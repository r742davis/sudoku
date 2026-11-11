import { fish, lockedCandidates, subsets } from "@/lib/sudoku/techniques";
import { fishPractice } from "./fish";
import { SWORDFISH_BOARDS } from "./swordfishBoards";

export const SWORDFISH = fishPractice({
	name: "Swordfish",
	size: 3,
	boards: SWORDFISH_BOARDS,
	// Any X-Wings are already applied, so what's left needs the bigger fish.
	prepare: grid => lockedCandidates(grid) || subsets(grid) || fish(grid, 2),
	pickStep: "Tap every cell of the Swordfish, then press Check pattern",
	intro: "Highlight a digit, then look for three rows (or three columns) whose spots for it all fall inside the same three columns (or rows). Each line only needs two or three of them.",
});
