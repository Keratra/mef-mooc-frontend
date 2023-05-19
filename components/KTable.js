export default function KTable({ className, children }) {
	return (
		<table
			className={
				'w-full border-spacing-0 rounded-lg border-solid border-2 border-zinc-300 shadow-lg ' +
				className
			}
		>
			{children}
		</table>
	);
}
