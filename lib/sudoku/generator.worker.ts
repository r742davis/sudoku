import { generatePuzzle } from "./generator";
import type { Difficulty } from "./types";

self.onmessage = (event: MessageEvent<Difficulty>) => {
	self.postMessage(generatePuzzle(event.data));
};
