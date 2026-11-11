import { EXPERT_PUZZLES } from "../../app/expert-puzzles";
import { PEERS, colOf, rowOf } from "./grid";
import { countSolutions, solve } from "./solver";
import { Candidates, fish, lockedCandidates, placeSingle, subsets } from "./techniques";
import type { Difficulty, Puzzle } from "./types";

/** Hardest technique a puzzle needs: 0 singles, 1 locked candidates and subsets, 2 fish, 3 beyond those. */
type Tier = 0 | 1 | 2 | 3;

const TARGET: Record<Exclude<Difficulty, "expert">, { tier: Tier; minGivens: number }> = {
	easy: { tier: 0, minGivens: 38 },
	medium: { tier: 0, minGivens: 0 },
	hard: { tier: 1, minGivens: 0 },
	extreme: { tier: 3, minGivens: 0 },
};

function shuffled<T>(items: T[]) {
	const out = [...items];
	for (let k = out.length - 1; k > 0; k--) {
		const swap = Math.floor(Math.random() * (k + 1));
		[out[k], out[swap]] = [out[swap], out[k]];
	}
	return out;
}

function solvedGrid() {
	const grid = new Array<number>(81).fill(0);
	const fill = (cell: number): boolean => {
		if (cell === 81) return true;
		for (const digit of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
			if (PEERS[cell].some(peer => grid[peer] === digit)) continue;
			grid[cell] = digit;
			if (fill(cell + 1)) return true;
		}
		grid[cell] = 0;
		return false;
	};
	fill(0);
	return grid;
}

/** Removes givens in random order for as long as the puzzle keeps exactly one solution. */
function dig(solution: number[], minGivens: number) {
	const givens = [...solution];
	let remaining = 81;
	for (const cell of shuffled(givens.map((_, k) => k))) {
		if (remaining <= minGivens) break;
		const digit = givens[cell];
		givens[cell] = 0;
		if (countSolutions(givens) === 1) remaining--;
		else givens[cell] = digit;
	}
	return givens;
}

export function gradePuzzle(givens: number[]): Tier {
	const grid = new Candidates(givens);
	let tier: Tier = 0;
	while (!grid.solved) {
		if (placeSingle(grid)) continue;
		if (lockedCandidates(grid) || subsets(grid)) {
			tier = Math.max(tier, 1) as Tier;
			continue;
		}
		if (fish(grid, 2) || fish(grid, 3)) {
			tier = 2;
			continue;
		}
		return 3;
	}
	return tier;
}

/**
 * Relabels digits, shuffles rows and columns within and across bands, and maybe transposes.
 * None of that changes which techniques a puzzle needs, so one puzzle becomes billions.
 */
function scramble(givens: number[]) {
	const digits = [0, ...shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])];
	const lines = () => shuffled([0, 1, 2]).flatMap(band => shuffled([0, 1, 2]).map(k => band * 3 + k));
	const rows = lines();
	const cols = lines();
	const transpose = Math.random() < 0.5;
	return givens.map((_, cell) => {
		const row = rows[rowOf(cell)];
		const col = cols[colOf(cell)];
		return digits[givens[transpose ? col * 9 + row : row * 9 + col]];
	});
}

export function generatePuzzle(difficulty: Difficulty): Puzzle {
	// Puzzles that need an X-Wing or Swordfish are rare (about 1 in 300), too slow to hunt for
	// on a phone, so Expert scrambles one from a pre-generated set instead.
	if (difficulty === "expert") {
		const seed = EXPERT_PUZZLES[Math.floor(Math.random() * EXPERT_PUZZLES.length)];
		const givens = scramble([...seed].map(Number));
		return { difficulty, givens, solution: solve(givens) };
	}

	const { tier, minGivens } = TARGET[difficulty];
	for (;;) {
		const solution = solvedGrid();
		const givens = dig(solution, minGivens);
		if (gradePuzzle(givens) === tier) return { difficulty, givens, solution };
	}
}
