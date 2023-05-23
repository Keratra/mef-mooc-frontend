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

const InfoBox = ({ title, value }) => {
	return (
		<div className='border-solid border-2 border-zinc-300 bg-white rounded-md min-w-[32rem] py-2 px-3 shadow-md'>
			<div className='font-semibold text-base'>{title}</div>
			<div className='text-xl mt-2'>{value}</div>
		</div>
	);
};

export default function StudentProfilePage() {
	const Router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	function openModal() {
		setIsOpen(true);
	}
	function closeModal() {
		setIsOpen(false);
	}

	async function handlePasswordChange(
		{ oldPassword, newPassword },
		{ setSubmitting }
	) {
		try {
			if (oldPassword === newPassword) {
				throw new Error('New password cannot be the same as old password');
			}

			await axios.post(`/api/change-password`, {
				userType: 'admin',
				oldPassword,
				newPassword,
			});

			notify('success', 'Operation successful');

			Router.reload();
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
			<PageTitle>Settings</PageTitle>

			{/* <span>{JSON.stringify(admin, null, 2)}</span> */}

			{/* <div className='flex flex-col justify-start items-center mt-2 gap-6 '>
				<InfoBox
					title={'Name'}
					value={admin?.name ?? '-' + ' ' + admin?.surname ?? '-'}
				/>
				<InfoBox title={'Email'} value={admin?.email ?? '-'} />
				<InfoBox title={'Department'} value={admin?.department ?? '-'} />
			</div> */}

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
						onSubmit={handlePasswordChange}
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
								<label className={classLabel} htmlFor='oldPassword'>
									Your Old Password
								</label>
								<input
									className={classInput}
									type='password'
									name='oldPassword'
									id='oldPassword'
									value={values.oldPassword}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.oldPassword &&
										touched.oldPassword &&
										errors.oldPassword}
								</span>

								<label className={classLabel} htmlFor='newPassword'>
									New Password
								</label>
								<input
									className={classInput}
									type='password'
									name='newPassword'
									id='newPassword'
									value={values.newPassword}
									onChange={handleChange}
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

// export async function getServerSideProps({ req }) {
// 	try {
// 		const token = req.cookies.token;
// 		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`;

// 		const { data } = await axios.get(backendURL, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		});

// 		const { admin } = data;

// 		return {
// 			props: {
// 				admin,
// 			},
// 		};
// 	} catch (error) {
// 		console.log(error);
// 		return {
// 			props: {
// 				admin: {},
// 			},
// 		};
// 	}
// }
