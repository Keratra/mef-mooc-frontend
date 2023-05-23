export default function KTable({ className = '', children, style }) {
	return (
		<tbody className={`divide-y divide-gray-200 ${className} `} style={style}>
			{children}
		</tbody>
	);
}
