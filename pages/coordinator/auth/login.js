import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginCoordinatorModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/auth/AuthProvider';
import { useApp, useAppUpdate } from 'contexts/AppContext';
import { USER_TYPE_COORDINATOR } from 'utils/constants';
import SignForm from '@components/SignForm';
import { notify } from 'utils/notify';

const loginType = USER_TYPE_COORDINATOR;

export default function Login() {
	const Router = useRouter();

	const { loginWithToken } = useAuth();

	const appState = useApp();
	const setAppState = useAppUpdate();

	const handleLogin = async ({ email, password }, { setSubmitting }) => {
		try {
			const { data } = await axios.post(`/api/coordinator/auth/login`, {
				email,
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

			Router.replace('/coordinator/courses');
		} catch (error) {
			console.log(error);
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		try {
			const email = prompt('Enter your email');

			if (!email) throw new Error('No email entered');

			const { data } = await axios.post(
				`/api/coordinator/auth/forgot-password`,
				{
					email,
				}
			);

			notify(
				'success',
				data?.message ?? 'Check your email for the new password'
			);
		} catch (error) {
			console.log(error);
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
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
			<SignForm
				title={'Coordinator Login'}
				identifier={['Email', 'email']}
				handleLogin={handleLogin}
				yupModel={loginCoordinatorModel}
				handleForgotPassword={handleForgotPassword}
			/>
		</div>
	);
}
