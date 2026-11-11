import type { ReactNode } from "react";
import { EraseIcon, NotesIcon, UndoIcon } from "./icons";

interface ActionButtonProps {
	label: string;
	icon: ReactNode;
	badge?: ReactNode;
	disabled?: boolean;
	pressed?: boolean;
	onClick: () => void;
}

function ActionButton({ label, icon, badge, disabled, pressed, onClick }: ActionButtonProps) {
	return (
		<button
			type='button'
			onClick={onClick}
			disabled={disabled}
			aria-pressed={pressed}
			className='flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-muted outline-accent focus-visible:outline-2 enabled:active:bg-peer disabled:opacity-40'>
			<span className='relative'>
				{icon}
				{badge}
			</span>
			<span className='text-sm font-medium'>{label}</span>
		</button>
	);
}

function NotesBadge({ on }: { on: boolean }) {
	return (
		<span
			className={`absolute -top-2 left-4 rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold leading-none tracking-wide text-surface ${
				on ? "bg-accent" : "bg-muted"
			}`}>
			{on ? "ON" : "OFF"}
		</span>
	);
}

interface ActionsProps {
	canUndo: boolean;
	notesMode: boolean;
	onUndo: () => void;
	onErase: () => void;
	onToggleNotes: () => void;
}

export function Actions({ canUndo, notesMode, onUndo, onErase, onToggleNotes }: ActionsProps) {
	return (
		<div className='grid grid-cols-3 justify-items-center'>
			<ActionButton label='Undo' icon={<UndoIcon />} disabled={!canUndo} onClick={onUndo} />
			<ActionButton label='Erase' icon={<EraseIcon />} onClick={onErase} />
			<ActionButton
				label='Notes'
				icon={<NotesIcon />}
				badge={<NotesBadge on={notesMode} />}
				pressed={notesMode}
				onClick={onToggleNotes}
			/>
		</div>
	);
}
