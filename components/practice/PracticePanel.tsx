import { RichText } from "@/components/ui/RichText";
import type { PracticeMessage, PracticePhase } from "@/lib/practice/engine";

const ORDER: PracticePhase[] = ["find", "eliminate", "place", "done"];

const MESSAGE_EDGE: Record<PracticeMessage["tone"], string> = {
	info: "border-l-accent",
	good: "border-l-[var(--tone-solve)]",
	bad: "border-l-danger",
};

function PracticeSteps({ phase, pickStep }: { phase: PracticePhase; pickStep: string }) {
	const steps = [pickStep, "Tap every cell that loses the digit", "Enter the digit this unlocks"];
	const current = ORDER.indexOf(phase);
	return (
		<ol className="flex flex-col gap-1.5">
			{steps.map((label, k) => {
				const state = k < current ? "done" : k === current ? "now" : "later";
				return (
					<li
						key={label}
						aria-current={state === "now" ? "step" : undefined}
						className={`flex items-baseline gap-3 ${
							state === "now"
								? "font-semibold text-ink"
								: state === "done"
									? "text-[var(--tone-solve)]"
									: "text-muted"
						}`}
					>
						<span className="font-mono text-xs">{state === "done" ? "✓" : `0${k + 1}`}</span>
						{label}
					</li>
				);
			})}
		</ol>
	);
}

function PanelButton({ primary, onClick, children }: { primary?: boolean; onClick: () => void; children: string }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`rounded-full px-4 py-2 text-sm font-semibold outline-offset-2 outline-accent focus-visible:outline-2 ${
				primary ? "bg-accent text-surface" : "border border-line bg-surface text-ink"
			}`}
		>
			{children}
		</button>
	);
}

interface PracticePanelProps {
	phase: PracticePhase;
	pickStep: string;
	message: PracticeMessage;
	slips: number;
	/** Present when the pattern's size varies, so the player decides when the pick is complete. */
	onCheck?: () => void;
	onHint: () => void;
	onClear: () => void;
	onReset: () => void;
	/** Omitted on the last board. */
	onNext?: () => void;
}

export function PracticePanel(props: PracticePanelProps) {
	const { phase, pickStep, message, slips, onCheck, onHint, onClear, onReset, onNext } = props;
	return (
		<div className="flex flex-col gap-4">
			<PracticeSteps phase={phase} pickStep={pickStep} />

			<p
				aria-live="polite"
				className={`min-h-24 rounded-r-xl border border-l-4 border-line bg-surface p-4 leading-relaxed ${MESSAGE_EDGE[message.tone]}`}
			>
				<RichText text={message.text} />
			</p>

			<div className="flex flex-wrap gap-2">
				{phase === "find" && onCheck && (
					<PanelButton primary onClick={onCheck}>
						Check pattern
					</PanelButton>
				)}
				{phase !== "done" && <PanelButton onClick={onHint}>Hint</PanelButton>}
				{phase === "find" && <PanelButton onClick={onClear}>Clear selection</PanelButton>}
				<PanelButton onClick={onReset}>Reset board</PanelButton>
				{phase === "done" && onNext && (
					<PanelButton primary onClick={onNext}>
						Next board
					</PanelButton>
				)}
			</div>

			<p className="text-sm text-muted">Slips on this board: {slips}</p>
		</div>
	);
}
