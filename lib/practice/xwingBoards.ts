import type { FishBoard } from "./fish";

/** Six real puzzles, each stuck where an X-Wing is the next move. Ordered easiest to noisiest. */
export const XWING_BOARDS: FishBoard[] = [
	{
		values: "012790453304120978079304621035000140087241530401003780043019067108000394796430015",
		digit: 5,
		kind: "col",
		lines: [1, 5],
		cross: [1, 7],
		cells: [10, 14, 64, 68],
		next: { cell: 66, digit: 6 },
	},
	{
		values: "000080070070032056000760930918423567623007004745816329001670000097201603000308700",
		digit: 8,
		kind: "col",
		lines: [1, 8],
		cross: [2, 6],
		cells: [19, 26, 55, 62],
		next: { cell: 60, digit: 2 },
	},
	{
		values: "690521004504600090000040500805034900920006405400000100359467000006000347740310659",
		digit: 3,
		kind: "row",
		lines: [0, 4],
		cross: [2, 7],
		cells: [2, 7, 38, 43],
		next: { cell: 6, digit: 7 },
	},
	{
		values: "850279160260541980100368000400083006300056090600924000528697001741835629936412578",
		digit: 7,
		kind: "row",
		lines: [1, 5],
		cross: [2, 8],
		cells: [11, 17, 47, 53],
		next: { cell: 33, digit: 2 },
	},
	{
		values: "598201007036000910014000850170050003483070105650013000827100040305020001901007000",
		digit: 6,
		kind: "row",
		lines: [2, 6],
		cross: [5, 8],
		cells: [23, 26, 59, 62],
		next: { cell: 13, digit: 8 },
	},
	{
		values: "708020053900806004000500809600302000003010002020065300890000230301250000070003400",
		digit: 4,
		kind: "col",
		lines: [2, 4],
		cross: [2, 6],
		cells: [20, 22, 56, 58],
		next: { cell: 34, digit: 4 },
	},
];
