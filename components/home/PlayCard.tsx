"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startFresh } from "@/lib/sudoku/storage";
import { DIFFICULTIES, type Difficulty } from "@/lib/sudoku/types";

export function PlayCard() {
	const router = useRouter();

	const startNewGame = (difficulty: Difficulty) => {
		startFresh(difficulty);
		router.push("/play");
	};

	return (
		<section className='flex flex-col gap-5 rounded-3xl bg-accent p-6 text-surface sm:p-8'>
			<div>
				<h2 className='text-3xl font-semibold'>Play</h2>
				<p className='mt-1 opacity-90'>
					A normal game with no lessons. Your last puzzle is saved where you left it.
				</p>
			</div>

			<Link
				href='/play'
				className='rounded-full bg-surface px-6 py-3 text-center text-lg font-semibold text-accent outline-offset-2 outline-surface focus-visible:outline-2'>
				Continue
			</Link>

			<div className='flex flex-col gap-2'>
				<h3 className='text-sm font-medium opacity-90'>Start a new game</h3>
				<div className='flex flex-wrap gap-2'>
					{DIFFICULTIES.map(difficulty => (
						<button
							key={difficulty}
							type='button'
							onClick={() => startNewGame(difficulty)}
							className='rounded-full border border-surface/60 px-4 py-1.5 font-medium capitalize outline-offset-2 outline-surface hover:bg-surface/15 focus-visible:outline-2'>
							{difficulty}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}
