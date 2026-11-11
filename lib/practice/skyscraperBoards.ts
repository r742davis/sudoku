import type { SkyscraperBoard } from "./skyscraper";

/** Six real puzzles, each stuck where a Skyscraper is the next move. Ordered easiest to noisiest. */
export const SKYSCRAPER_BOARDS: SkyscraperBoard[] = [
	{
		values: "418325679692178453357946821500809060921467385000502094000701036100203048035684910",
		digit: 7,
		base: [72, 80],
		tops: [45, 35],
		next: { cell: 28, digit: 4 },
	},
	{
		values: "000800007790003504100000200805000000243986175907020008409007806600040791071698400",
		digit: 2,
		base: [12, 57],
		tops: [11, 55],
		next: { cell: 0, digit: 3 },
	},
	{
		values: "405987603000604597796030048659740302007050469240396005173860904562479831984003006",
		digit: 2,
		base: [76, 78],
		tops: [13, 24],
		next: { cell: 1, digit: 2 },
	},
	{
		values: "028000900190004006000902000400700061200600038061050700006000180000100002012800670",
		digit: 4,
		base: [40, 76],
		tops: [42, 80],
		next: { cell: 0, digit: 6 },
	},
	{
		values: "160000030703100500004300701091706800008001300000890140010028073030004000200600000",
		digit: 2,
		base: [2, 3],
		tops: [47, 39],
		next: { cell: 3, digit: 4 },
	},
	{
		values: "050970348497200000038045279805090037041307985973500620304750800580400700709800000",
		digit: 6,
		base: [18, 36],
		tops: [21, 40],
		next: { cell: 5, digit: 1 },
	},
];
