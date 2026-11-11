export type Family = "fish" | "links" | "wings" | "uniqueness";

export const FAMILIES: Record<Family, { label: string; color: string }> = {
	fish: { label: "Fish", color: "var(--tone-base)" },
	links: { label: "Strong links", color: "var(--tone-pin)" },
	wings: { label: "Wings", color: "var(--tone-alt)" },
	uniqueness: { label: "Uniqueness", color: "var(--tone-solve)" },
};

/** How a diagram cell is drawn. "a" and "b" are the two colors of Simple Coloring. */
export type CellRole = "base" | "pin" | "fin" | "elim" | "a" | "b" | "solve";

export interface Diagram {
	/** Keyed by cell name ("r2c3"). The value is the digits to show, optionally followed by "|role". */
	cells: Record<string, string>;
	/** Pairs of cell names joined by a strong ("s") or weak ("w") link. */
	links?: [string, string, "s" | "w"][];
	/** Rows and columns to shade, such as "r2" or "c7". */
	bands?: string[];
	/** Boxes to shade, numbered 1 to 9. */
	boxes?: number[];
}

export interface Technique {
	slug: string;
	name: string;
	family: Family;
	buildsOn: string;
	summary: string;
	/** Paragraphs. {r2c3} renders as a cell reference and *text* as emphasis. */
	body: string[];
	example?: string[];
	tip: string;
	diagram: Diagram;
	caption: string;
}
