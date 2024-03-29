export default function KTable({ tableHeaders, className, children }) {
	return (
		<thead
			className={
				'bg-gradient-to-t from-zinc-300 to-zinc-200 text-black  ' + className
			}
		>
			<tr>
				{!!tableHeaders &&
					tableHeaders.map(({ alignment, name, className, extra }, idx) => (
						<th
							key={idx}
							scope='col'
							align={alignment}
							className={`min-w-[170px] px-4 py-2 font-semibold text-xl ${className} `}
						>
							<span className='text-center drop-shadow-md'>
								{extra} {name}
							</span>
						</th>
					))}
				{children}
			</tr>
		</thead>
	);
}
