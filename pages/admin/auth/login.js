import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginAdminModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from 'contexts/auth/AuthProvider';
import { useApp, useAppUpdate } from 'contexts/AppContext';
import { USER_TYPE_ADMIN } from 'utils/constants';
import SignForm from '@components/SignForm';
import { notify } from 'utils/notify';

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

			Router.replace('/admin/dashboard');
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

	const handleForgotPassword = async () => {
		try {
			const email = prompt('Enter your email');

			if (!email) throw new Error('No email entered');

			const { data } = await axios.post(`/api/admin/auth/forgot-password`, {
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
				title={'Administrator Login'}
				identifier={['Username', 'username']}
				handleLogin={handleLogin}
				yupModel={loginAdminModel}
				handleForgotPassword={handleForgotPassword}
			/>
		</div>
	);
}
