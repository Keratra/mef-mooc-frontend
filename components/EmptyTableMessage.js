export default function Loader({ message, cols }) {
	return (
		<tr>
			<td
				colSpan={cols}
				className='w-full p-2 font-semibold text-xl text-red-600'
			>
				{message}
			</td>
		</tr>
	);
}
