import type { ReactNode } from "react";

interface BoardOverlayProps {
	title: string;
	detail?: string;
	/** Buttons, usually one or two OverlayButtons. */
	children?: ReactNode;
}

export function BoardOverlay({ title, detail, children }: BoardOverlayProps) {
	return (
		<div
			role='status'
			className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/85 p-6 text-center backdrop-blur-sm'>
			<h2 className='text-2xl font-semibold'>{title}</h2>
			{detail && <p className='max-w-64 text-muted'>{detail}</p>}
			{children && <div className='mt-2 flex flex-wrap justify-center gap-3'>{children}</div>}
		</div>
	);
}

export function OverlayButton({
	primary,
	onClick,
	children,
}: {
	primary?: boolean;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			className={`rounded-full px-5 py-2 font-medium outline-offset-2 outline-accent focus-visible:outline-2 ${
				primary ? "bg-accent text-surface" : "border border-line text-ink"
			}`}>
			{children}
		</button>
	);
}
