export interface XWingBoard {
	/** The puzzle at the moment it gets stuck: 81 digits, row by row, 0 for empty. */
	values: string;
	/** `lines` are the two base rows (or columns); `cross` are the two columns (or rows) they share. Zero-based. */
	xwing: { digit: number; kind: "row" | "col"; lines: number[]; cross: number[] };
	/** The placement the X-Wing unlocks. */
	next: { cell: number; digit: number };
}

/** Six real puzzles, each stuck where an X-Wing is the next move. Ordered easiest to noisiest. */
export const XWING_BOARDS: XWingBoard[] = [
	{
		values: "012790453304120978079304621035000140087241530401003780043019067108000394796430015",
		xwing: { digit: 5, kind: "col", lines: [1, 5], cross: [1, 7] },
		next: { cell: 66, digit: 6 },
	},
	{
		values: "000080070070032056000760930918423567623007004745816329001670000097201603000308700",
		xwing: { digit: 8, kind: "col", lines: [1, 8], cross: [2, 6] },
		next: { cell: 60, digit: 2 },
	},
	{
		values: "690521004504600090000040500805034900920006405400000100359467000006000347740310659",
		xwing: { digit: 3, kind: "row", lines: [0, 4], cross: [2, 7] },
		next: { cell: 6, digit: 7 },
	},
	{
		values: "850279160260541980100368000400083006300056090600924000528697001741835629936412578",
		xwing: { digit: 7, kind: "row", lines: [1, 5], cross: [2, 8] },
		next: { cell: 33, digit: 2 },
	},
	{
		values: "598201007036000910014000850170050003483070105650013000827100040305020001901007000",
		xwing: { digit: 6, kind: "row", lines: [2, 6], cross: [5, 8] },
		next: { cell: 13, digit: 8 },
	},
	{
		values: "708020053900806004000500809600302000003010002020065300890000230301250000070003400",
		xwing: { digit: 4, kind: "col", lines: [2, 4], cross: [2, 6] },
		next: { cell: 34, digit: 4 },
	},
];
