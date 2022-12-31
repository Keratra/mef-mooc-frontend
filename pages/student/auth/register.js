import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { registerStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function StudentRegisterPage({ departments }) {
	const Router = useRouter();
	// console.log(departments);

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
			const { data } = await axios.post(`/api/student/auth/login`, {
				student_no,
				name,
				surname,
				email,
				password,
				department_id,
			});

			// const { data } = await axios.post(
			// 	`${process.env.NEXT_PUBLIC_API_URL}/student/login`,
			// 	{
			// 		student_no,
			// 		name,
			// 		surname,
			// 		email,
			// 		password,
			// 		department_id,
			// 	}
			// );

			Router.replace('/student/auth/login');
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
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
								error={touched.student_no && Boolean(errors.student_no)}
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
								error={touched.name && Boolean(errors.name)}
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
								error={touched.surname && Boolean(errors.surname)}
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
								error={touched.email && Boolean(errors.email)}
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
								error={touched.password && Boolean(errors.password)}
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
								error={
									touched.confirmPassword && Boolean(errors.confirmPassword)
								}
							/>
							<span className={classError}>
								{errors.confirmPassword &&
									touched.confirmPassword &&
									errors.confirmPassword}
							</span>

							<label className={classLabel} htmlFor='department_id'>
								Department
							</label>
							<input
								className={classInput}
								type='text'
								name='department_id'
								id='department_id'
								value={values.department_id}
								onChange={handleChange}
								error={touched.department_id && Boolean(errors.department_id)}
							/>
							<span className={classError}>
								{errors.department_id &&
									touched.department_id &&
									errors.department_id}
							</span>

							{/* <TextField
                id='email'
                name='email'
                label='Email'
                placeholder='Emailinizi giriniz...'
                className={'md:col-span-2 ' + classInput}
                fullWidth
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              /> */}

							{/* <FormControl fullWidth>
                <InputLabel id={'admin_id_label'} className={``}>
                  Marka
                </InputLabel>
                <Select
                  id='admin_id'
                  name='admin_id'
                  label='Marka'
                  labelId='admin_id_label'
                  className='bg-neutral-50'
                  fullWidth
                  value={values.admin_id}
                  onChange={handleChange}
                  error={touched.admin_id && Boolean(errors.admin_id)}
                >
                  {brands.map(({ id, brand }) => (
                    <MenuItem key={id} value={id}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
                <p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-600 bg-neutral-50 rounded-b-lg'>
                  {errors.admin_id && touched.admin_id && errors.admin_id}
                </p>
              </FormControl> */}

							{/* <TextField
                id='name'
                name='name'
                label='Ad'
                placeholder='Bayi adını giriniz...'
                className={classInput}
                fullWidth
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />

              <TextField
                id='password'
                name='password'
                label='Şifre'
                type='password'
                placeholder='Şifrenizi giriniz...'
                className={classInput}
                fullWidth
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <TextField
                id='confirmPassword'
                name='confirmPassword'
                label='Tekrar Şifre'
                type='password'
                placeholder='Tekrar Şifrenizi giriniz...'
                fullWidth
                className={classInput}
                value={values.confirmPassword}
                onChange={handleChange}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              /> */}

							<button
								variant='contained'
								color='primary'
								size='large'
								type='submit'
								className={`mx-auto  my-4 md:col-span-2 tracking-wider text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
								disabled={isSubmitting}
							>
								Register
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

// export async function getServerSideProps(context) {
//   const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/all-departments`;

//   const { data } = await axios.get(backendURL);

//   const { departments } = data;

//   return {
//     props: {
//       departments,
//     },
//   };
// }
