import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { submitBundleModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import {
	UsersIcon,
	UserMinusIcon,
	PencilSquareIcon,
	ChevronDoubleRightIcon,
	PlusIcon,
} from '@heroicons/react/24/solid';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import { notify } from 'utils/notify';

const bundleStatus = {
	'Waiting Bundle': 'Bundle waiting for approval',
	'Waiting Approval': 'Certificates waiting for approval',
	'Waiting Certificates': 'Upload your certificates',
	'Rejected Bundle': 'Bundle rejected',
	'Rejected Certificates': 'Certificates rejected',
	'Accepted Certificates': 'Certificates accepted',
};

export default function BundleViewPage({ course_id, bundle_id, bundle }) {
	const Router = useRouter();
	const [isOpenSub, setIsOpenSub] = useState(false);

	function closeModalSub() {
		setIsOpenSub(false);
	}
	function openModalSub() {
		setIsOpenSub(true);
	}

	const handleLinkUpdate = async (bundle_detail_id) => {
		try {
			const certificate_url = prompt('Enter the link to the certificate here');

			if (certificate_url === null || certificate_url === '')
				throw new Error('Please enter a valid certificate link');

			await axios.post('/api/student/certificate-update', {
				course_id,
				bundle_id,
				bundle_detail_id,
				certificate_url,
			});

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
		}
	};
	const handleFeedbackUpdate = async (feedback_id) => {
		try {
			const certificate_url = prompt('Enter the feedback here');

			if (certificate_url === null || certificate_url === '')
				throw new Error('Please enter a valid feedback');

			await axios.post('/api/student/feedback', {
				feedback_id,
			});

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
		}
	};

	const handleBundleComplete = async ({ comment }, { setSubmitting }) => {
		try {
			await axios.post('/api/student/bundle-complete', {
				course_id,
				bundle_id,
				comment,
			});
			Router.push(`/student/${course_id}/bundles`);
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
			closeModalSub();
		}
	};

	const classLabel = `
		md:col-span-2
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
			<PageTitle>Selected Bundle</PageTitle>

			{bundle[0]?.bundle_status === 'Waiting Certificates' && (
				<div className='mb-4 text-center'>
					<span className='text-center'>
						You can upload your certification links here. Once you have uploaded
						all the links, you can mark the bundle as complete.
						<br />
						However, you can only upload certificates once your bundle is
						approved by your coordinator.
					</span>
				</div>
			)}

			<div className='mt-12 mb-4 text-2xl font-semibold text-center'>
				This bundle&apos;s status:{' '}
				<span className='font-medium text-center'>
					{bundleStatus[bundle[0]?.bundle_status]}
				</span>
			</div>

			<div className='w-full max-w-7xl mx-auto'>
				<KTable>
					<KTableHead
						tableHeaders={
							bundle[0]?.bundle_status === 'Waiting Certificates'
								? [
										{
											name: 'MOOC ID',
											alignment: 'left',
											className: 'rounded-tl-md',
										},
										{ name: 'MOOC Name', alignment: 'left' },
										{ name: 'Certificate Link', alignment: 'left' },
										{ name: 'Average Hours', alignment: 'center' },
										{
											name: 'Add Certificate',
											alignment: 'center',
											className: 'rounded-tr-md',
										},
								  ]
								: [
										{
											name: 'MOOC ID',
											alignment: 'left',
											className: 'rounded-tl-md',
										},
										{ name: 'MOOC Name', alignment: 'left' },
										{ name: 'Certificate Link', alignment: 'left' },
										{
											name: 'Average Hours',
											alignment: 'center',
											className: 'rounded-tr-md',
										},
								  ]
						}
					></KTableHead>
					<KTableBody>
						{!!bundle &&
							bundle.map(
								(
									{
										bundle_detail_id,
										certificate_url,
										mooc_id,
										mooc_name,
										feedback_id,
										average_hours,
									},
									idx
								) => (
									<tr
										key={bundle_detail_id}
										className={
											idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
										}
									>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{mooc_id}
										</td>
										<td className='px-4 py-4 text-lg font-medium'>
											{mooc_name}
										</td>

										<td className='px-4 py-4 text-lg font-medium min-w-[15vw]'>
											{!!certificate_url ? (
												<NextLink
													href={certificate_url ?? ''}
													className='text-blue-600 hover:underline underline-offset-2'
												>
													{certificate_url}
												</NextLink>
											) : (
												<span className='text-rose-700'>
													No certificate uploaded
												</span>
											)}
										</td>

										<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											{average_hours}
										</td>

										{bundle[0]?.bundle_status === 'Waiting Certificates' && (
											<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
												<button
													onClick={() => handleLinkUpdate(bundle_detail_id)}
													className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'
												>
													<PlusIcon className='h-7 w-7 text-zinc-900 hover:text-zinc-500 cursor-pointer transition-colors' />
												</button>
											</td>
										)}
									</tr>
								)
							)}
						{bundle?.length !== 0 && (
							<tr>
								<td
									colSpan={
										bundle[0]?.bundle_status === 'Waiting Certificates' ? 5 : 4
									}
									className=' p-4 text-center border-0 border-y border-solid border-zinc-500/[0.3] bg-zinc-100'
								>
									<span className='text-xl'>
										Total of{' '}
										<span className='font-semibold'>
											{bundle
												.map(({ average_hours }) => average_hours)
												.reduce((a, b) => a + b, 0)}
										</span>{' '}
										hours
									</span>
								</td>
							</tr>
						)}
						{bundle?.length === 0 && (
							<EmptyTableMessage
								cols={4}
								message='No bundle details were found...'
							/>
						)}
					</KTableBody>
				</KTable>

				{bundle[0]?.bundle_status === 'Waiting Certificates' && (
					<>
						<div className='mt-4 px-4 py-4 text-lg font-medium text-center '>
							<button
								onClick={openModalSub}
								className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
							>
								COMPLETE BUNDLE
							</button>
						</div>

						<div className='text-center'>
							<span className='text-center'>
								By clicking the “Submit Bundle” button, you send your bundle to
								your coordinator for confirmation. <br />
								Please make sure you entered valid links that directs to your
								certificates.
							</span>
						</div>
					</>
				)}
			</div>

			<Modal
				{...{
					isOpen: isOpenSub,
					setIsOpen: setIsOpenSub,
					closeModal: closeModalSub,
					openModal: openModalSub,
				}}
				title='Submit your Bundle'
			>
				<div className={` transition-all mt-2 `}>
					<Formik
						initialValues={submitBundleModel.initials}
						validationSchema={submitBundleModel.schema}
						onSubmit={handleBundleComplete}
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
								<label className={classLabel} htmlFor='comment'>
									Bundle Feedback
								</label>

								<textarea
									className={classInput}
									type='text'
									name='comment'
									id='comment'
									style={{ resize: 'vertical' }}
									value={values.comment}
									onChange={handleChange}
									maxLength={2000}
								/>
								<span className={classError}>
									{errors.comment && touched.comment && errors.comment}
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
									<span>{isSubmitting ? 'SUBMITING...' : 'SUBMIT'}</span>
								</button>
							</form>
						)}
					</Formik>
				</div>
			</Modal>
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	const { id: course_id, bundle_id } = query;
	const token = req.cookies.token;
	const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/enrollments/${course_id}/bundles/${bundle_id}`;

	const { data } = await axios.get(backendURL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const { bundle } = data;

	console.log(bundle);

	return {
		props: {
			course_id,
			bundle_id,
			bundle: bundle ?? [],
		},
	};
}
