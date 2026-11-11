import { PEERS, bitOf, colOf, rowOf } from "@/lib/sudoku/grid";

/** Cell reference in lesson markup, rendered as a chip by RichText. */
export const ref = (cell: number) => `{r${rowOf(cell) + 1}c${colOf(cell) + 1}}`;

export const lineName = (kind: "row" | "col", index: number) => `${kind === "row" ? "row" : "column"} ${index + 1}`;

/** "a", "a and b", "a, b and c" */
export function joinWords(words: string[], last = "and") {
	if (words.length < 2) return words.join("");
	return `${words.slice(0, -1).join(", ")} ${last} ${words[words.length - 1]}`;
}

export const hasCandidate = (candidates: number[], cell: number, digit: number) =>
	Boolean(candidates[cell] & bitOf(digit));

/** Cells that can see both `a` and `b`. */
export const commonPeers = (a: number, b: number) => PEERS[a].filter(cell => cell !== b && PEERS[b].includes(cell));

/** Groups cells by their row or column index. */
export function groupBy(cells: number[], indexOf: (cell: number) => number) {
	const groups = new Map<number, number[]>();
	for (const cell of cells) groups.set(indexOf(cell), [...(groups.get(indexOf(cell)) ?? []), cell]);
	return groups;
}
