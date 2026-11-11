import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
	return (
		<svg
			viewBox='0 0 24 24'
			className='size-7'
			fill='none'
			stroke='currentColor'
			strokeWidth={1.6}
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'>
			{children}
		</svg>
	);
}

export const UndoIcon = () => (
	<Icon>
		<path d='M4 5v5h5' />
		<path d='M4.6 10A8 8 0 1 1 4 13' />
	</Icon>
);

export const EraseIcon = () => (
	<Icon>
		<path d='M13.5 4.5 20 11l-8 8H7l-3.5-3.5a1.5 1.5 0 0 1 0-2z' />
		<path d='m8.5 9.5 6.5 6.5' />
		<path d='M15 20h6' />
	</Icon>
);

export const NotesIcon = () => (
	<Icon>
		<path d='M15.5 4.5 19.5 8.5 9 19l-5 1 1-5z' />
		<path d='m13 7 4 4' />
		<path d='M14 20h7' />
	</Icon>
);

export const PauseIcon = () => (
	<Icon>
		<path d='M9 6v12M15 6v12' />
	</Icon>
);

export const PlayIcon = () => (
	<Icon>
		<path d='M8 5.5v13l10-6.5z' />
	</Icon>
);
