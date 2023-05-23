import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { changePasswordModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import { notify } from 'utils/notify';
import PasswordBox from '@components/PasswordBox';

const InfoBox = ({ title, value }) => {
	return (
		<div className='border-solid border-2 border-zinc-300 bg-white rounded-md min-w-[32rem] py-2 px-3 shadow-md'>
			<div className='font-semibold text-base'>{title}</div>
			<div className='text-xl mt-2'>{value}</div>
		</div>
	);
};

export default function StudentProfilePage({ student }) {
	const Router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	function openModal() {
		setIsOpen(true);
	}
	function closeModal() {
		setIsOpen(false);
	}

	async function handleChange({ oldPassword, newPassword }, { setSubmitting }) {
		try {
			if (oldPassword === newPassword) {
				throw new Error('New password cannot be the same as old password');
			}

			await axios.post(`/api/change-password`, {
				userType: 'student',
				oldPassword,
				newPassword,
			});

			notify('success', 'Operation successful');
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
	}

	const classLabel = `
		md:col-span-full
		mt-3 p-2 -mb-4 rounded-lg
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
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Student Profile</PageTitle>

			{/* <span>
				{JSON.stringify(student, null, 2)}{' '}
			</span> */}

			<div className='flex flex-col justify-start items-center mt-2 gap-6 '>
				<InfoBox
					title={'Name'}
					value={(student?.name ?? '-') + ' ' + (student?.surname ?? '-')}
				/>
				<InfoBox title={'Student NO'} value={student?.student_no ?? '-'} />
				<InfoBox title={'Email'} value={student?.email ?? '-'} />
				<InfoBox title={'Department'} value={student?.department ?? '-'} />
			</div>

			<div>
				<button
					onClick={openModal}
					className={`mx-auto  my-4 md:col-span-2 tracking-wider text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
				>
					Change Password
				</button>
			</div>

			<Modal
				{...{
					isOpen,
					setIsOpen,
					closeModal,
					openModal,
				}}
				title='Change your Password'
			>
				<div className={`transition-all mt-2 `}>
					<Formik
						initialValues={changePasswordModel.initials}
						validationSchema={changePasswordModel.schema}
						onSubmit={handleChange}
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
								<PasswordBox
									title='Current Password'
									classLabel={classLabel}
									classInput={classInput}
									oid='oldPassword'
									values={values.oldPassword}
									handleChange={handleChange}
								/>
								<span className={classError}>
									{errors.oldPassword &&
										touched.oldPassword &&
										errors.oldPassword}
								</span>

								<PasswordBox
									title='New Password'
									classLabel={classLabel}
									classInput={classInput}
									oid='newPassword'
									values={values.newPassword}
									handleChange={handleChange}
								/>
								<span className={classError}>
									{errors.newPassword &&
										touched.newPassword &&
										errors.newPassword}
								</span>

								<button
									variant='contained'
									color='primary'
									size='large'
									type='submit'
									className={`uppercase mx-auto  my-4 md:col-span-2 tracking-wider text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
									disabled={isSubmitting}
								>
									<div
										className={`inline-block rounded-sm bg-purple-500 ${
											isSubmitting && 'w-4 h-4 mr-2 animate-spin'
										}`}
									></div>
									<span>
										{isSubmitting ? 'Changing...' : 'Change Password'}
									</span>
								</button>
							</form>
						)}
					</Formik>
				</div>
			</Modal>
		</div>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/profile`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { student } = data;

		return {
			props: {
				student,
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				student: {},
			},
		};
	}
}
