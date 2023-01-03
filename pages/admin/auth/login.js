import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginAdminModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/auth/AuthProvider';
import { useApp, useAppUpdate } from 'contexts/AppContext';
import { USER_TYPE_ADMIN } from 'utils/constants';

const loginType = USER_TYPE_ADMIN;

export default function Login() {
	const Router = useRouter();

	const { loginWithToken } = useAuth();

	const appState = useApp();
	const setAppState = useAppUpdate();

	const handleLogin = async ({ username, password }, { setSubmitting }) => {
		// alert(JSON.stringify({ student_no, password }, null, 2));

		try {
			const { data } = await axios.post(`/api/admin/auth/login`, {
				username,
				password,
			});

			loginWithToken({
				token: data.access_token,
				userName: data.brand,
				userType: loginType,
			});

			setAppState({
				...appState,
				token: data.access_token,
				userType: loginType,
			});

			Router.replace('/admin/departments');
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
					initialValues={loginAdminModel.initials}
					validationSchema={loginAdminModel.schema}
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
								Administrator Login
							</h1>

							<label className={classLabel} htmlFor='username'>
								Username
							</label>
							<input
								className={classInput}
								type='text'
								name='username'
								id='username'
								value={values.username}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.username && touched.username && errors.username}
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

							<button
								variant='contained'
								color='primary'
								size='large'
								type='submit'
								className={`mx-auto  my-4 md:col-span-2 tracking-wider text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
								disabled={isSubmitting}
							>
								Login
							</button>

							<span className={`md:col-span-2 place-self-center`}>
								Don&apos;t have an account?{' '}
								<NextLink href='/student/auth/register' passHref>
									<span className={`text-blue-500 no-underline`}>
										Register now.
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
