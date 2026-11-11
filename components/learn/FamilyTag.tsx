import { FAMILIES, type Family } from "@/lib/learn/types";

export function FamilyTag({ family }: { family: Family }) {
	const { label, color } = FAMILIES[family];
	return (
		<span className='inline-flex items-center gap-1.5 text-sm font-medium text-muted'>
			<span className='size-2.5 rounded-full' style={{ background: color }} />
			{label}
		</span>
	);
}
