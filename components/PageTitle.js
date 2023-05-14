export default function PageTitle({ className, children }) {
	return (
		<div>
			<h1
				className={
					'text-center text-xl md:text-3xl my-4 drop-shadow-md' + className
				}
			>
				{children}
			</h1>
		</div>
	);
}
