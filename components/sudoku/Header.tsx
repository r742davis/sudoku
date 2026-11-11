import type { ReactNode } from "react";
import { DIFFICULTIES, MAX_MISTAKES, type Difficulty } from "@/lib/sudoku/types";
import { PauseIcon, PlayIcon } from "./icons";

function HeaderStat({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className='flex flex-col items-center gap-0.5'>
			<span className='text-xs font-medium text-muted sm:text-sm'>{label}</span>
			<span className='text-sm font-medium tabular-nums sm:text-base'>{children}</span>
		</div>
	);
}

function HeaderDate({ startedOn }: { startedOn: string }) {
	const date = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
	return <HeaderStat label='Date'>{date.format(new Date(startedOn))}</HeaderStat>;
}

function HeaderDifficulty({ value, onChange }: { value: Difficulty; onChange: (difficulty: Difficulty) => void }) {
	return (
		<HeaderStat label='Difficulty'>
			<select
				id='difficulty'
				aria-label='Difficulty. Changing it starts a new game.'
				className='cursor-pointer bg-transparent text-center capitalize outline-none focus-visible:underline'
				value={value}
				onChange={event => onChange(event.target.value as Difficulty)}>
				{DIFFICULTIES.map(difficulty => (
					<option key={difficulty} value={difficulty} className='bg-surface'>
						{difficulty}
					</option>
				))}
			</select>
		</HeaderStat>
	);
}

function HeaderMistakes({ mistakes }: { mistakes: number }) {
	return (
		<HeaderStat label='Mistakes'>
			<span className={mistakes ? "text-danger" : undefined}>
				{mistakes}/{MAX_MISTAKES}
			</span>
		</HeaderStat>
	);
}

function HeaderTimer({
	elapsed,
	paused,
	onTogglePause,
}: {
	elapsed: number;
	paused: boolean;
	onTogglePause: () => void;
}) {
	const pad = (n: number) => String(n).padStart(2, "0");
	const hours = Math.floor(elapsed / 3600);
	const time = `${hours ? `${hours}:` : ""}${pad(Math.floor(elapsed / 60) % 60)}:${pad(elapsed % 60)}`;
	return (
		<div className='flex items-center gap-2'>
			<HeaderStat label='Time'>{time}</HeaderStat>
			<button
				type='button'
				onClick={onTogglePause}
				aria-label={paused ? "Resume" : "Pause"}
				className='grid size-10 place-items-center rounded-full bg-peer text-muted outline-accent focus-visible:outline-2'>
				{paused ? <PlayIcon /> : <PauseIcon />}
			</button>
		</div>
	);
}

interface HeaderProps {
	startedOn: string;
	difficulty: Difficulty;
	mistakes: number;
	elapsed: number;
	paused: boolean;
	onDifficultyChange: (difficulty: Difficulty) => void;
	onTogglePause: () => void;
}

export function Header(props: HeaderProps) {
	return (
		<header className='flex items-center justify-between gap-2 px-1'>
			<HeaderDate startedOn={props.startedOn} />
			<HeaderDifficulty value={props.difficulty} onChange={props.onDifficultyChange} />
			<HeaderMistakes mistakes={props.mistakes} />
			<HeaderTimer elapsed={props.elapsed} paused={props.paused} onTogglePause={props.onTogglePause} />
		</header>
	);
}
