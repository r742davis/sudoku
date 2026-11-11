import { SudokuGame } from "@/components/sudoku/SudokuGame";
import { AppBar } from "@/components/ui/AppBar";

export default function PlayPage() {
	return (
		<>
			<AppBar backHref='/' backLabel='Menu' title='Play' />
			<SudokuGame />
		</>
	);
}
