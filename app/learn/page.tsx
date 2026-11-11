import Link from "next/link";
import { FamilyTag } from "@/components/learn/FamilyTag";
import { AppBar } from "@/components/ui/AppBar";
import { PRACTICE_SLUGS, TECHNIQUES } from "@/lib/learn/techniques";

export default function LearnPage() {
	return (
		<>
			<AppBar backHref='/' backLabel='Menu' title='Learn' />
			<main className='mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8'>
				<header>
					<h1 className='text-3xl font-semibold tracking-tight'>Technique ladder</h1>
					<p className='mt-2 text-muted'>
						Work down the list in order. Most of these reuse one idea, the strong link: when a row, column
						or box has exactly two spots left for a digit, one of them must hold it.
					</p>
				</header>

				<ol className='flex flex-col gap-3'>
					{TECHNIQUES.map((technique, k) => (
						<li key={technique.slug}>
							<Link
								href={`/learn/${technique.slug}`}
								className='flex items-start gap-4 rounded-2xl border border-line bg-surface p-4 outline-offset-2 outline-accent hover:border-accent focus-visible:outline-2'>
								<span className='grid size-10 shrink-0 place-items-center rounded-full bg-tint font-mono text-sm font-semibold text-accent'>
									{String(k + 1).padStart(2, "0")}
								</span>
								<span className='flex min-w-0 flex-col gap-1'>
									<span className='flex flex-wrap items-center gap-x-3 gap-y-1'>
										<span className='text-lg font-semibold'>{technique.name}</span>
										<FamilyTag family={technique.family} />
										{PRACTICE_SLUGS.includes(technique.slug) && (
											<span className='theme-practice rounded-full bg-tint px-2 py-0.5 text-xs font-semibold text-accent'>
												Practice boards
											</span>
										)}
									</span>
									<span className='text-muted'>{technique.summary}</span>
								</span>
							</Link>
						</li>
					))}
				</ol>
			</main>
		</>
	);
}
