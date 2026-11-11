import { lockedCandidates, subsets } from "@/lib/sudoku/techniques";
import { fishPractice } from "./fish";
import { XWING_BOARDS } from "./xwingBoards";

export const X_WING = fishPractice({
	name: "X-Wing",
	size: 2,
	boards: XWING_BOARDS,
	prepare: grid => lockedCandidates(grid) || subsets(grid),
	pickStep: "Tap the four corner cells of the X-Wing",
	intro: "Highlight a digit to see where it can go, then look for two rows (or two columns) where it fits in exactly the same two places.",
});
