import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordBox({
	title,
	classLabel,
	classInput,
	oid,
	values,
	handleChange,
}) {
	const [show, setShow] = useState(false);
	return (
		<>
			<label className={classLabel} htmlFor={oid}>
				{title}
			</label>
			<input
				className={classInput}
				type={show ? 'text' : 'password'}
				name={oid}
				id={oid}
				value={values}
				onChange={handleChange}
			/>
			<span
				className={'flex justify-start items-center gap-2 ml-2 '}
				onClick={() => setShow(() => !show)}
			>
				{show ? (
					<FiEyeOff size={22} className='' />
				) : (
					<FiEye size={22} className='' />
				)}
				<span className=''>{!show ? 'Show Password' : 'Hide Password'} </span>
			</span>
		</>
	);
}
