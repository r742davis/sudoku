import type { ReactNode } from "react";

/** Everything under /learn uses the violet Learn theme. */
export default function LearnLayout({ children }: { children: ReactNode }) {
	return <div className='theme-learn min-h-dvh'>{children}</div>;
}
