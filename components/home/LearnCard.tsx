import Link from "next/link";
import { TECHNIQUES } from "@/lib/learn/techniques";

export function LearnCard() {
	return (
		<section className='theme-learn flex flex-col gap-4 rounded-3xl border border-line bg-tint p-6 sm:p-8'>
			<div>
				<p className='text-sm font-semibold tracking-wide text-accent uppercase'>Learn</p>
				<h2 className='mt-1 text-2xl font-semibold'>Technique ladder</h2>
				<p className='mt-1 text-muted'>
					{TECHNIQUES.length} advanced techniques, from X-Wing to Unique Rectangle, each building on the one
					before.
				</p>
			</div>

			<Link
				href='/learn'
				className='rounded-full bg-accent px-6 py-2.5 text-center font-semibold text-surface outline-offset-2 outline-accent focus-visible:outline-2'>
				Open the ladder
			</Link>

			<Link
				href='/learn/x-wing/practice'
				className='theme-practice flex items-center justify-between gap-3 rounded-2xl border border-line bg-tint px-4 py-3 outline-offset-2 outline-accent focus-visible:outline-2'>
				<span>
					<span className='block text-sm font-semibold tracking-wide text-accent uppercase'>Practice</span>
					<span className='font-medium'>X-Wing practice boards</span>
				</span>
				<span aria-hidden='true' className='text-xl text-accent'>
					→
				</span>
			</Link>
		</section>
	);
}
