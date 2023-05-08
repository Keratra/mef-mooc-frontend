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

const loginType = USER_TYPE_STUDENT;

export default function Login() {
	const Router = useRouter();

	const { loginWithToken } = useAuth();

	const appState = useApp();
	const setAppState = useAppUpdate();

	const handleLogin = async ({ student_no, password }, { setSubmitting }) => {
		// alert(JSON.stringify({ student_no, password }, null, 2));

		try {
			const { data } = await axios.post(`/api/student/auth/login`, {
				student_no,
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

	return (
		<div>
			<SignForm
				title={'Student Login'}
				identifier={['Student No', 'student_no']}
				handleLogin={handleLogin}
				hasRegisterRedirect={'/student/auth/register'}
				yupModel={loginStudentModel}
			/>
		</div>
	);
}
