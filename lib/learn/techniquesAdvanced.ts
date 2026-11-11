import type { Technique } from "./types";

export const COMBINATIONS_AND_UNIQUENESS: Technique[] = [
	{
		slug: "w-wing",
		name: "W-Wing",
		family: "wings",
		buildsOn: "Builds on: Y-Wing and strong links together",
		summary: "Two matching pairs bridged by a strong link.",
		body: [
			"A W-Wing joins the two threads. Take two cells with the same pair, say {5,8}, that don't see each other. On their own they prove nothing. Now find a strong link on 5 where one end sees the first cell and the other end sees the second.",
			"Suppose {r1c2} isn't 8. Then it's 5. That stops {r4c2} being 5 (same column), so the strong link puts 5 at {r4c6}, which stops {r7c6} being 5, which makes it 8. So if one pair cell isn't 8, the other one is. At least one of them is 8.",
			"Any cell seeing both pair cells loses 8. Here that's {r1c6} and {r7c2}.",
		],
		tip: "Identical pairs are easy to see across the grid. When you find two that don't see each other, check whether either digit has a strong link bridging them. The elimination is the *other* digit, not the one in the bridge.",
		diagram: {
			bands: ["r4"],
			cells: { r1c2: "58|pin", r7c6: "58|pin", r4c2: "5|base", r4c6: "5|base", r1c6: "8|elim", r7c2: "8|elim" },
			links: [
				["r4c2", "r4c6", "s"],
				["r1c2", "r4c2", "w"],
				["r7c6", "r4c6", "w"],
			],
		},
		caption: "Matching {5,8} pairs bridged by a strong link on 5. One of them must be 8.",
	},
	{
		slug: "finned-x-wing",
		name: "Finned X-Wing",
		family: "fish",
		buildsOn: "Builds on: X-Wing and the box logic from Crane",
		summary: "An almost X-Wing that still works inside the fin's box.",
		body: [
			"Back to the very first pattern. Sometimes an X-Wing is almost there, but one row has an extra candidate spoiling it. If that extra candidate, the fin, shares a box with one of the X-Wing corners, you can still get something.",
			"Split the problem in two. If the fin isn't 5, you have a clean X-Wing and it clears columns 3 and 8. If the fin is 5, it clears its own box. A cell is safe to eliminate only when both cases kill it, so the targets are cells in an X-Wing column that are also in the fin's box.",
		],
		example: [
			"Same rows and columns as the first X-Wing, but row 7 also allows 5 at {r7c9}. That fin lives in box 9 with the corner {r7c8}. Column 8 inside box 9 means {r8c8} and {r9c8}; their 5s go. The 5s at {r4c8} and {r5c3} would have died in a clean X-Wing, but here they stay because the fin can't reach them.",
		],
		tip: "An X-Wing shape with one or two stray candidates bunched in a box next to a corner. The same fin trick applies to Swordfish.",
		diagram: {
			bands: ["r2", "r7"],
			boxes: [9],
			cells: {
				r2c3: "5|base",
				r2c8: "5|base",
				r7c3: "5|base",
				r7c8: "5|base",
				r7c9: "5|fin",
				r8c8: "5|elim",
				r9c8: "5|elim",
				r4c8: "5",
				r5c3: "5",
			},
			links: [["r2c3", "r2c8", "s"]],
		},
		caption: "The fin at r7c9 limits eliminations to column 8 inside box 9.",
	},
	{
		slug: "empty-rectangle",
		name: "Empty Rectangle",
		family: "links",
		buildsOn: "Builds on: Crane, with a whole box acting as a link",
		summary: "A cross-shaped box links its row to its column.",
		body: [
			"In the Crane, a box with exactly two candidates gave a strong link. The Empty Rectangle stretches that idea: a box whose candidates for a digit all sit on one row and one column of the box, in a cross shape. The other four cells of the box (the empty rectangle) have none.",
			"Such a box acts like a strong link between its row and its column. If the digit isn't in the cross's row, it has to be in the cross's column, and the other way around.",
			"Now add an ordinary strong link that touches one arm of the cross from outside the box. Column 8 has 1 only at {r5c8} and {r1c8}, and {r5c8} is on row 5, the cross's row.",
			"If {r1c8} is 1, then {r1c5} can't be (row 1). If {r1c8} isn't 1, then {r5c8} is, which pushes box 5's 1 off row 5 and onto column 5, and again {r1c5} can't be 1. Either way, {r1c5} loses its 1.",
		],
		tip: "The target is where the far end's row meets the cross's other line. The box's center cell doesn't matter; the cross can include or skip it.",
		diagram: {
			boxes: [5],
			cells: {
				r4c5: "1|base",
				r6c5: "1|base",
				r5c4: "1|base",
				r5c6: "1|base",
				r5c8: "1|pin",
				r1c8: "1|pin",
				r1c5: "1|elim",
				r8c5: "1",
			},
			links: [
				["r5c8", "r1c8", "s"],
				["r5c6", "r5c8", "w"],
			],
		},
		caption: "Box 5's 1s form a cross on row 5 and column 5, so the box works as a link.",
	},
	{
		slug: "unique-rectangle",
		name: "Unique Rectangle",
		family: "uniqueness",
		buildsOn: "Different logic: the puzzle has only one solution",
		summary: "Avoid the four-cell pattern that would allow two solutions.",
		body: [
			"This one doesn't use links at all. It uses the fact that a proper puzzle has exactly one solution.",
			"Picture four cells at the corners of a rectangle, spanning exactly two rows, two columns and two boxes, all holding only {3,8}. Whatever you put in them, you could swap every 3 for 8 and every 8 for 3 and nothing else in the grid would notice. That's two solutions, which a valid puzzle can't have. This is called a deadly pattern.",
			"So if three corners are {3,8} and the fourth is {3,6,8}, the fourth corner must not be 3 or 8, or you'd create the deadly pattern. It has to be 6.",
		],
		example: [
			"{r1c1}, {r1c5} and {r2c1} are {3,8}. {r2c5} started as {3,6,8}. The rectangle spans boxes 1 and 2. Remove 3 and 8 and {r2c5} is solved as 6.",
			"That's Type 1. In Type 2, two corners both carry the same extra digit. One of them must be that digit to avoid the deadly pattern, so any cell seeing both loses it.",
		],
		tip: "Scan for repeated pairs in two boxes that share a band. Only use this on puzzles you trust to have one solution, and check the four cells really cover exactly two boxes.",
		diagram: {
			boxes: [1, 2],
			cells: { r1c1: "38|base", r1c5: "38|base", r2c1: "38|base", r2c5: "6|solve" },
			links: [
				["r1c1", "r1c5", "w"],
				["r2c1", "r2c5", "w"],
				["r1c1", "r2c1", "w"],
				["r1c5", "r2c5", "w"],
			],
		},
		caption: "r2c5 began as 3, 6, 8. Keeping 3 or 8 would create a deadly pattern, so it's 6.",
	},
];
