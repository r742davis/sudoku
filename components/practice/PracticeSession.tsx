"use client";

import { useReducer } from "react";
import { createPractice, practiceReducer, type PracticeAction, type PracticeState } from "@/lib/practice/engine";
import { PRACTICE_SETS } from "@/lib/practice/sets";
import type { PracticeSet } from "@/lib/practice/types";
import { PracticeBoard } from "./PracticeBoard";
import { PracticeDigits } from "./PracticeDigits";
import { PracticePanel } from "./PracticePanel";

const LEVELS = ["Warm-up", "Warm-up", "Steady", "Steady", "Tricky", "Tricky"];

interface Session {
	set: PracticeSet;
	index: number;
	cleared: number[];
	practice: PracticeState;
}

type SessionAction = PracticeAction | { type: "open"; index: number };

function openBoard(set: PracticeSet, index: number, cleared: number[]): Session {
	return { set, index, cleared, practice: createPractice(set, set.boards[index]) };
}

function sessionReducer(session: Session, action: SessionAction): Session {
	if (action.type === "open") return openBoard(session.set, action.index, session.cleared);
	const practice = practiceReducer(session.practice, action);
	const newlyCleared = practice.phase === "done" && !session.cleared.includes(session.index);
	return { ...session, practice, cleared: newlyCleared ? [...session.cleared, session.index] : session.cleared };
}

interface BoardTabsProps {
	count: number;
	index: number;
	cleared: number[];
	onOpen: (index: number) => void;
}

function BoardTabs({ count, index, cleared, onOpen }: BoardTabsProps) {
	return (
		<div role="tablist" aria-label="Practice boards" className="flex flex-wrap gap-2">
			{Array.from({ length: count }, (_, k) => (
				<button
					key={k}
					type="button"
					role="tab"
					aria-selected={k === index}
					onClick={() => onOpen(k)}
					className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold outline-offset-2 outline-accent focus-visible:outline-2 ${
						k === index ? "border-accent bg-accent text-surface" : "border-line bg-surface text-ink"
					}`}
				>
					Board {k + 1}
					<span className="font-normal opacity-80">{LEVELS[k]}</span>
					{cleared.includes(k) && <span aria-label="cleared">✓</span>}
				</button>
			))}
		</div>
	);
}

/** Runs the practice boards for one technique. `slug` must be a key of PRACTICE_SETS. */
export function PracticeSession({ slug }: { slug: string }) {
	const [{ set, index, cleared, practice }, dispatch] = useReducer(sessionReducer, slug, initial =>
		openBoard(PRACTICE_SETS[initial], 0, []),
	);

	return (
		<div className="flex flex-col gap-5">
			<BoardTabs
				count={set.boards.length}
				index={index}
				cleared={cleared}
				onOpen={k => dispatch({ type: "open", index: k })}
			/>

			<div className="grid gap-6 md:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] md:items-start">
				<div className="flex flex-col gap-4">
					<PracticeBoard state={practice} onTap={cell => dispatch({ type: "tapCell", cell })} />
					{practice.phase !== "done" && (
						<PracticeDigits
							placing={practice.phase === "place"}
							highlight={practice.highlight}
							onTap={digit => dispatch({ type: "tapDigit", digit })}
						/>
					)}
				</div>

				<PracticePanel
					phase={practice.phase}
					pickStep={set.pickStep}
					message={practice.message}
					slips={practice.slips}
					onCheck={set.pickCount === null ? () => dispatch({ type: "check" }) : undefined}
					onHint={() => dispatch({ type: "hint" })}
					onClear={() => dispatch({ type: "clear" })}
					onReset={() => dispatch({ type: "reset" })}
					onNext={
						index < set.boards.length - 1 ? () => dispatch({ type: "open", index: index + 1 }) : undefined
					}
				/>
			</div>
		</div>
	);
}
