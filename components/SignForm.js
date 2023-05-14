import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { BiLoaderAlt } from 'react-icons/bi';

export default function SignForm({ title, identifier, handleLogin, yupModel }) {
	const classLabel = `
  md:col-span-2
  mt-4 p-2 -mb-2 rounded-lg
  text-xl font-semibold
`;

	const classInput = `
  md:col-span-2
  p-2 rounded-lg
  border-solid border-2 border-neutral-400
  text-base bg-neutral-50
`;

	const classError = `
  md:col-span-2
  ml-2 rounded-lg
  text-base text-red-600
  drop-shadow-md
`;

	return (
		<div
			className={`max-w-md md:max-w-2xl mx-auto my-24 py-6 md:px-6 transition-transform rounded-3xl border-solid border-neutral-200 shadow-lg bg-white`}
		>
			<Formik
				initialValues={yupModel.initials}
				validationSchema={yupModel.schema}
				onSubmit={handleLogin}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleSubmit,
					isSubmitting,
				}) => (
					<form
						onSubmit={handleSubmit}
						className={`grid grid-cols-1 md:grid-cols-2 gap-2 content-center place-content-center px-4`}
					>
						<h1
							className={`md:col-span-2 font-bold text-center text-5xl  drop-shadow-md`}
						>
							{title}
						</h1>

						<label className={classLabel} htmlFor='student_no'>
							{identifier[0]}
						</label>
						<input
							className={classInput}
							type='text'
							name={identifier[1]}
							id={identifier[1]}
							value={values[identifier[1]]}
							onChange={handleChange}
						/>
						<span className={classError}>
							{errors[identifier[1]] &&
								touched[identifier[1]] &&
								errors[identifier[1]]}
						</span>

						<label className={classLabel} htmlFor='password'>
							Password
						</label>
						<input
							className={classInput}
							type='password'
							name='password'
							id='password'
							value={values.password}
							onChange={handleChange}
						/>
						<span className={classError}>
							{errors.password && touched.password && errors.password}
						</span>

						<button
							variant='contained'
							color='primary'
							size='large'
							type='submit'
							className={`mx-auto  my-4 md:col-span-2 tracking-wider text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
							disabled={isSubmitting}
						>
							<div
								className={`rounded-sm flex flex-col justify-center items-center  ${
									isSubmitting && ' animate-spin'
								}`}
							>
								{isSubmitting ? <BiLoaderAlt size={24} /> : 'Login'}
							</div>
						</button>
					</form>
				)}
			</Formik>
		</div>
	);
}
