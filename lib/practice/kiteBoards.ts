import type { KiteBoard } from "./kite";

/** Six real puzzles, each stuck where a Two-String Kite is the next move. Ordered easiest to noisiest. */
export const KITE_BOARDS: KiteBoard[] = [
	{
		values: "537609402408003000106005000810300900360092008970851030659127000780500000240908007",
		digit: 7,
		joined: [34, 42],
		ends: [31, 15],
		next: { cell: 7, digit: 1 },
	},
	{
		values: "357006021094072356000300790071003900039000060005040030900700600746238519500000270",
		digit: 4,
		joined: [23, 3],
		ends: [26, 75],
		next: { cell: 73, digit: 1 },
	},
	{
		values: "300927008078154320200386700820075193037091802010238067180749230403862071702513084",
		digit: 5,
		joined: [69, 62],
		ends: [64, 26],
		next: { cell: 19, digit: 4 },
	},
	{
		values: "500030000490060025160050900000008602000570009000200010700020003045700200000005497",
		digit: 3,
		joined: [68, 75],
		ends: [63, 30],
		next: { cell: 27, digit: 9 },
	},
	{
		values: "309050010104000000562109038945312867826705301731000000057400180413087650098501070",
		digit: 2,
		joined: [71, 78],
		ends: [66, 6],
		next: { cell: 1, digit: 7 },
	},
	{
		values: "800000005510006048300080000000478500058012004400059800705000081083000406004800900",
		digit: 3,
		joined: [13, 5],
		ends: [15, 59],
		next: { cell: 1, digit: 4 },
	},
];
