import type { FishBoard } from "./fish";

/** Six real puzzles, each stuck where a Swordfish is the next move. Ordered easiest to noisiest. */
export const SWORDFISH_BOARDS: FishBoard[] = [
	{
		values: "600003040001060073020005016040027685000600724276458030902706450000090062068502397",
		digit: 1,
		kind: "row",
		lines: [0, 3, 8],
		cross: [0, 3, 4],
		cells: [3, 4, 27, 30, 72, 76],
		next: { cell: 21, digit: 8 },
	},
	{
		values: "082000795970005080065879000521008900798006430040790508857100049039084100010907800",
		digit: 2,
		kind: "col",
		lines: [5, 6, 7],
		cross: [2, 5, 6],
		cells: [24, 25, 50, 52, 59, 60],
		next: { cell: 26, digit: 4 },
	},
	{
		values: "005083090049021800600090000004956712192300050567000900400005069056000007001060520",
		digit: 3,
		kind: "col",
		lines: [2, 4, 6],
		cross: [2, 6, 7],
		cells: [20, 24, 56, 58, 60, 67, 69],
		next: { cell: 12, digit: 6 },
	},
	{
		values: "690038104078004500400000860046009050207005906050000708020100400000000605064080090",
		digit: 1,
		kind: "row",
		lines: [1, 3, 8],
		cross: [0, 4, 8],
		cells: [9, 13, 27, 31, 35, 72, 80],
		next: { cell: 40, digit: 4 },
	},
	{
		values: "008004610074806503000000840082600104900148205415327986051460008003080050800002060",
		digit: 9,
		kind: "row",
		lines: [1, 3, 6],
		cross: [4, 5, 7],
		cells: [13, 16, 31, 32, 59, 61],
		next: { cell: 68, digit: 1 },
	},
	{
		values: "400560329069302000523490060600034210200050036300726090006203950135040082902005003",
		digit: 7,
		kind: "col",
		lines: [0, 4, 7],
		cross: [1, 6, 8],
		cells: [9, 13, 16, 54, 58, 76, 79],
		next: { cell: 5, digit: 8 },
	},
];
