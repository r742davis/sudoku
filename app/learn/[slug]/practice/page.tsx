import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PracticeSession } from "@/components/practice/PracticeSession";
import { AppBar } from "@/components/ui/AppBar";
import { findTechnique } from "@/lib/learn/techniques";
import { PRACTICE_SLUGS } from "@/lib/practice/sets";

export function generateStaticParams() {
	return PRACTICE_SLUGS.map(slug => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

/**
 * The slug is only known per request, so it's read inside <Suspense>. That lets Next.js
 * send the page shell immediately instead of blocking the navigation on `params`.
 */
export default function PracticePage({ params }: PageProps) {
	return (
		<Suspense fallback={null}>
			<PracticeContent params={params} />
		</Suspense>
	);
}

async function PracticeContent({ params }: PageProps) {
	const { slug } = await params;
	const technique = findTechnique(slug);
	if (!technique || !PRACTICE_SLUGS.includes(slug)) notFound();

	return (
		<div className='theme-practice min-h-dvh'>
			<AppBar backHref={`/learn/${slug}`} backLabel={technique.name} title='Practice' />
			<main className='mx-auto flex max-w-4xl flex-col gap-5 px-3 py-6'>
				<header>
					<h1 className='text-3xl font-semibold tracking-tight'>{technique.name} practice boards</h1>
					<p className='mt-2 max-w-prose text-muted'>
						Six real puzzles, each stuck where the {technique.name} is the next move. The pencil marks are
						already trimmed with the simpler techniques that come before it on the ladder.
					</p>
				</header>
				<PracticeSession slug={slug} />
			</main>
		</div>
	);
}
