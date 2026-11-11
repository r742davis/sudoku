import { BOXES, COLS, PEERS, ROWS, UNITS, bitOf, boxOf, colOf, countBits, rowOf } from "./grid";

/** Candidate grid that the human-style techniques below work on. */
export class Candidates {
	values: number[];
	masks: number[];

	constructor(givens: number[]) {
		this.values = new Array<number>(81).fill(0);
		this.masks = new Array<number>(81).fill(0x1ff);
		givens.forEach((digit, cell) => {
			if (digit) this.place(cell, digit);
		});
	}

	get solved() {
		return this.values.every(Boolean);
	}

	place(cell: number, digit: number) {
		this.values[cell] = digit;
		this.masks[cell] = 0;
		for (const peer of PEERS[cell]) this.masks[peer] &= ~bitOf(digit);
	}

	remove(cell: number, mask: number) {
		if (!(this.masks[cell] & mask)) return false;
		this.masks[cell] &= ~mask;
		return true;
	}

	spots(unit: number[], digit: number) {
		return unit.filter(cell => this.masks[cell] & bitOf(digit));
	}
}

function combinations<T>(items: T[], size: number): T[][] {
	if (size === 0) return [[]];
	return items.flatMap((item, k) => combinations(items.slice(k + 1), size - 1).map(rest => [item, ...rest]));
}

/** Naked single, then hidden single. Places one digit per call. */
export function placeSingle(grid: Candidates) {
	for (let cell = 0; cell < 81; cell++) {
		if (!grid.values[cell] && countBits(grid.masks[cell]) === 1) {
			grid.place(cell, Math.log2(grid.masks[cell]) + 1);
			return true;
		}
	}
	for (const unit of UNITS) {
		for (let digit = 1; digit <= 9; digit++) {
			const spots = grid.spots(unit, digit);
			if (spots.length === 1) {
				grid.place(spots[0], digit);
				return true;
			}
		}
	}
	return false;
}

/** Pointing pairs and box-line reduction. */
export function lockedCandidates(grid: Candidates) {
	let changed = false;
	const sweep = (from: number[][], unitFor: (cell: number) => number[], sameUnit: (cell: number) => number) => {
		for (const unit of from) {
			for (let digit = 1; digit <= 9; digit++) {
				const spots = grid.spots(unit, digit);
				if (spots.length < 2 || new Set(spots.map(sameUnit)).size !== 1) continue;
				for (const cell of unitFor(spots[0])) {
					if (!unit.includes(cell) && grid.remove(cell, bitOf(digit))) changed = true;
				}
			}
		}
	};
	sweep(BOXES, cell => ROWS[rowOf(cell)], rowOf);
	sweep(BOXES, cell => COLS[colOf(cell)], colOf);
	sweep([...ROWS, ...COLS], cell => BOXES[boxOf(cell)], boxOf);
	return changed;
}

/** Naked and hidden pairs and triples. */
export function subsets(grid: Candidates) {
	let changed = false;
	for (const unit of UNITS) {
		const open = unit.filter(cell => !grid.values[cell]);
		const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(digit => grid.spots(open, digit).length);
		for (const size of [2, 3]) {
			if (open.length <= size) continue;
			for (const cells of combinations(open, size)) {
				const mask = cells.reduce((all, cell) => all | grid.masks[cell], 0);
				if (countBits(mask) !== size) continue;
				for (const cell of open) {
					if (!cells.includes(cell) && grid.remove(cell, mask)) changed = true;
				}
			}
			for (const group of combinations(digits, size)) {
				const mask = group.reduce((all, digit) => all | bitOf(digit), 0);
				const cells = open.filter(cell => grid.masks[cell] & mask);
				if (cells.length !== size) continue;
				for (const cell of cells) {
					if (grid.remove(cell, 0x1ff & ~mask)) changed = true;
				}
			}
		}
	}
	return changed;
}

/** X-Wing (size 2) and Swordfish (size 3), on rows and on columns. */
export function fish(grid: Candidates, size: number) {
	let changed = false;
	for (let digit = 1; digit <= 9; digit++) {
		for (const [lines, cross] of [
			[ROWS, COLS],
			[COLS, ROWS],
		]) {
			const positions = lines.map(line =>
				line.reduce((mask, cell, k) => (grid.masks[cell] & bitOf(digit) ? mask | (1 << k) : mask), 0)
			);
			const usable = positions
				.map((_, k) => k)
				.filter(k => countBits(positions[k]) >= 2 && countBits(positions[k]) <= size);
			for (const base of combinations(usable, size)) {
				const cover = base.reduce((mask, k) => mask | positions[k], 0);
				if (countBits(cover) !== size) continue;
				for (let k = 0; k < 9; k++) {
					if (!(cover & (1 << k))) continue;
					cross[k].forEach((cell, line) => {
						if (!base.includes(line) && grid.remove(cell, bitOf(digit))) changed = true;
					});
				}
			}
		}
	}
	return changed;
}
