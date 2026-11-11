import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagramLegend } from "@/components/learn/DiagramLegend";
import { FamilyTag } from "@/components/learn/FamilyTag";
import { TechniqueDiagram } from "@/components/learn/TechniqueDiagram";
import { AppBar } from "@/components/ui/AppBar";
import { RichText } from "@/components/ui/RichText";
import { PRACTICE_SLUGS, TECHNIQUES, findTechnique } from "@/lib/learn/techniques";

export function generateStaticParams() {
	return TECHNIQUES.map(({ slug }) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

/**
 * The slug is only known per request, so it's read inside <Suspense>. That lets Next.js
 * send the page shell immediately instead of blocking the navigation on `params`.
 */
export default function TechniquePage({ params }: PageProps) {
	return (
		<Suspense fallback={null}>
			<TechniqueContent params={params} />
		</Suspense>
	);
}

async function TechniqueContent({ params }: PageProps) {
	const { slug } = await params;
	const technique = findTechnique(slug);
	if (!technique) notFound();

	const index = TECHNIQUES.indexOf(technique);
	const previous = TECHNIQUES[index - 1];
	const next = TECHNIQUES[index + 1];

	return (
		<>
			<AppBar backHref='/learn' backLabel='Ladder' title={`${index + 1} of ${TECHNIQUES.length}`} />
			<main className='mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8'>
				<header className='flex flex-col gap-2'>
					<FamilyTag family={technique.family} />
					<h1 className='text-4xl font-semibold tracking-tight'>{technique.name}</h1>
					<p className='text-muted'>{technique.buildsOn}</p>
				</header>

				<div className='grid gap-8 md:grid-cols-[minmax(0,1fr)_22rem]'>
					<article className='flex min-w-0 flex-col gap-4 text-[1.05rem] leading-relaxed'>
						{technique.body.map(paragraph => (
							<p key={paragraph}>
								<RichText text={paragraph} />
							</p>
						))}
						{technique.example && (
							<>
								<h2 className='mt-2 text-sm font-semibold tracking-wide text-accent uppercase'>
									In the example
								</h2>
								{technique.example.map(paragraph => (
									<p key={paragraph}>
										<RichText text={paragraph} />
									</p>
								))}
							</>
						)}
						<aside className='mt-2 rounded-2xl bg-tint p-4'>
							<h2 className='text-sm font-semibold tracking-wide text-accent uppercase'>
								How to spot it
							</h2>
							<p className='mt-1'>
								<RichText text={technique.tip} />
							</p>
						</aside>
					</article>

					<figure className='flex flex-col gap-3 md:sticky md:top-6 md:self-start'>
						<div className='rounded-2xl border border-line bg-surface p-3'>
							<TechniqueDiagram diagram={technique.diagram} label={`${technique.name} example grid`} />
						</div>
						<figcaption className='text-sm text-muted'>{technique.caption}</figcaption>
						<DiagramLegend />
					</figure>
				</div>

				{PRACTICE_SLUGS.includes(technique.slug) && (
					<section className='theme-practice flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-tint p-6'>
						<div>
							<p className='text-sm font-semibold tracking-wide text-accent uppercase'>Practice</p>
							<h2 className='mt-1 text-xl font-semibold'>{technique.name} practice boards</h2>
							<p className='mt-1 text-muted'>
								Six real puzzles, each stuck where this technique is the next move.
							</p>
						</div>
						<Link
							href={`/learn/${technique.slug}/practice`}
							className='rounded-full bg-accent px-6 py-2.5 font-semibold text-surface outline-offset-2 outline-accent focus-visible:outline-2'>
							Start practicing
						</Link>
					</section>
				)}

				<nav className='flex justify-between gap-4 border-t border-line pt-5 font-medium text-accent'>
					{previous ? <Link href={`/learn/${previous.slug}`}>← {previous.name}</Link> : <span />}
					{next && <Link href={`/learn/${next.slug}`}>{next.name} →</Link>}
				</nav>
			</main>
		</>
	);
}
