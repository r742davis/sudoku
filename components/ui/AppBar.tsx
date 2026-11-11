import Link from "next/link";

interface AppBarProps {
	backHref: string;
	backLabel: string;
	title: string;
}

/** Top bar for every page below the menu. Its tint and link color come from the section theme. */
export function AppBar({ backHref, backLabel, title }: AppBarProps) {
	return (
		<nav className='border-b border-line bg-tint'>
			<div className='mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3'>
				<Link
					href={backHref}
					className='rounded-full font-medium text-accent outline-offset-4 outline-accent focus-visible:outline-2'>
					<span aria-hidden='true'>← </span>
					{backLabel}
				</Link>
				<span className='font-semibold'>{title}</span>
			</div>
		</nav>
	);
}
