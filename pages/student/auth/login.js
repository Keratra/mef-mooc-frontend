import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/auth/AuthProvider';
import { useApp, useAppUpdate } from 'contexts/AppContext';
import { USER_TYPE_STUDENT } from 'utils/constants';
import SignForm from '@components/SignForm';
import { notify } from 'utils/notify';

const loginType = USER_TYPE_STUDENT;

export default function Login() {
	const Router = useRouter();

	const { loginWithToken } = useAuth();

	const appState = useApp();
	const setAppState = useAppUpdate();

	const handleLogin = async ({ email, password }, { setSubmitting }) => {
		try {
			const { data } = await axios.post(`/api/student/auth/login`, {
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

			Router.replace('/student/courses');
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

			const { data } = await axios.post(`/api/student/auth/forgot-password`, {
				email,
			});

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

	return (
		<div>
			<SignForm
				title={'Student Login'}
				identifier={['Email', 'email']}
				handleLogin={handleLogin}
				yupModel={loginStudentModel}
				handleForgotPassword={handleForgotPassword}
			/>
		</div>
	);
}
