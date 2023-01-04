import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { registerStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function StudentRegisterPage({ departments }) {
	const Router = useRouter();

	const handleRegister = async (
		{ student_no, name, surname, email, password, department_id },
		{ setSubmitting }
	) => {
		// alert(
		// 	JSON.stringify(
		// 		{ student_no, name, surname, email, password, department_id },
		// 		null,
		// 		2
		// 	)
		// );

		try {
			if (department_id === 0) throw 'Please select a department';

			const { data } = await axios.post(`/api/student/auth/register`, {
				student_no,
				name,
				surname,
				email,
				password,
				department_id,
			});

			Router.replace('/student/auth/login');
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		} finally {
			setSubmitting(false);
		}
	};

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
		<div>
			<div
				className={`max-w-md md:max-w-2xl mx-auto my-24 py-6 md:px-6 transition-transform rounded-3xl`}
			>
				<Formik
					initialValues={registerStudentModel.initials}
					validationSchema={registerStudentModel.schema}
					onSubmit={handleRegister}
				>
					{({
						setFieldValue,
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
								Student Register
							</h1>

							<label className={classLabel} htmlFor='student_no'>
								Student No
							</label>
							<input
								className={classInput}
								type='text'
								name='student_no'
								id='student_no'
								value={values.student_no}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.student_no && touched.student_no && errors.student_no}
							</span>

							<label className={classLabel} htmlFor='name'>
								Name
							</label>
							<input
								className={classInput}
								type='text'
								name='name'
								id='name'
								value={values.name}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.name && touched.name && errors.name}
							</span>

							<label className={classLabel} htmlFor='surname'>
								Surname
							</label>
							<input
								className={classInput}
								type='text'
								name='surname'
								id='surname'
								value={values.surname}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.surname && touched.surname && errors.surname}
							</span>

							<label className={classLabel} htmlFor='email'>
								Email
							</label>
							<input
								className={classInput}
								type='text'
								name='email'
								id='email'
								value={values.email}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.email && touched.email && errors.email}
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

							<label className={classLabel} htmlFor='confirmPassword'>
								Confirm Password
							</label>
							<input
								className={classInput}
								type='password'
								name='confirmPassword'
								id='confirmPassword'
								value={values.confirmPassword}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.confirmPassword &&
									touched.confirmPassword &&
									errors.confirmPassword}
							</span>

							<label className={classLabel} htmlFor='department_id'>
								Department
							</label>
							<select
								name='department_id'
								id='department_id'
								className={classInput}
								value={values.department_id}
								onChange={(e) => {
									setFieldValue('department_id', e.target.value);
								}}
							>
								<option value={0}>None</option>
								{!!departments &&
									departments.map(({ id, name }) => (
										<option key={id} value={id}>
											{name}
										</option>
									))}
							</select>
							<span className={classError}>
								{errors.department_id &&
									touched.department_id &&
									errors.department_id}
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
									className={`inline-block rounded-sm bg-purple-500 ${
										isSubmitting && 'w-4 h-4 mr-2 animate-spin'
									}`}
								></div>
								<span>{isSubmitting ? 'Registering...' : 'Register'}</span>
							</button>

							<span className={`md:col-span-2 place-self-center`}>
								Have an account?{' '}
								<NextLink href='/student/auth/login' passHref>
									<span className={`text-blue-500 no-underline`}>
										Login now.
									</span>
								</NextLink>
							</span>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/all-departments`;

	const { data } = await axios.get(backendURL);

	const { departments } = data;

	return {
		props: {
			departments,
		},
	};
}
