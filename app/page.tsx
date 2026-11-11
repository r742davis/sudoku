import { LearnCard } from "@/components/home/LearnCard";
import { PlayCard } from "@/components/home/PlayCard";

export default function Home() {
	return (
		<main className='mx-auto flex max-w-xl flex-col gap-5 px-4 py-10'>
			<h1 className='text-4xl font-semibold tracking-tight'>Sudoku</h1>
			<PlayCard />
			<LearnCard />
		</main>
	);
}
