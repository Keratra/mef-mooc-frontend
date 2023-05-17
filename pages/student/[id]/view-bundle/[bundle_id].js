import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { editMOOCModel, loginStudentModel } from 'lib/yupmodels';
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

	const handleBundleComplete = async () => {
		try {
			if (!confirm('Are you sure?')) throw Error('Action cancelled by user');

			await axios.post('/api/student/bundle-complete', {
				course_id,
				bundle_id,
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
		}
	};

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Selected Bundle</PageTitle>

			<div className='mb-4 text-center'>
				<span className='text-center'>
					You can upload your certification links here. Once you have uploaded
					all the links, you can mark the bundle as complete.
					<br />
					However, you can only upload certificates once your bundle is approved
					by your coordinator.
				</span>
			</div>

			<div className='w-full max-w-7xl mx-auto'>
				<KTable>
					<KTableHead
						tableHeaders={[
							{
								name: 'MOOC ID',
								alignment: 'left',
								className: 'rounded-tl-md',
							},
							{ name: 'MOOC Name', alignment: 'left' },
							{ name: 'Certificate Link', alignment: 'left' },
							{ name: 'Add Certificate', alignment: 'center' },
						]}
					></KTableHead>
					<KTableBody>
						{!!bundle &&
							bundle.map(
								({
									bundle_detail_id,
									certificate_url,
									mooc_id,
									mooc_name,
									feedback_id,
								}) => (
									<tr
										key={bundle_detail_id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{mooc_id}
										</td>
										<td className='px-4 py-4 text-lg font-medium'>
											{mooc_name}
										</td>

										<td className='px-4 py-4 text-lg font-medium min-w-[15vw]'>
											<NextLink
												href={certificate_url ?? ''}
												className='text-blue-600 hover:underline underline-offset-2'
											>
												{certificate_url}
											</NextLink>
										</td>

										<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => handleLinkUpdate(bundle_detail_id)}
												className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'
											>
												<PlusIcon className='h-7 w-7 text-zinc-900 hover:text-zinc-500 cursor-pointer transition-colors' />
											</button>
											<button className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'></button>
										</td>
										{/* <td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => handleFeedbackUpdate(feedback_id)}
												className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'
											>
												Update Feedback
											</button>
										</td> */}
									</tr>
								)
							)}
						{bundle?.length === 0 && (
							<EmptyTableMessage
								cols={4}
								message='No bundle details were found...'
							/>
						)}
					</KTableBody>
				</KTable>

				<div className=' px-4 py-4 text-lg font-medium text-center '>
					<button
						onClick={() => {
							setIsOpenSub();
							handleBundleComplete();
						}}
						className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
					>
						COMPLETE BUNDLE
					</button>
				</div>

				<div className='text-center'>
					<span className='text-center'>
						By clicking the “Submit Bundle” button, you send your bundle to your
						coordinator for confirmation. <br />
						Please make sure you entered valid links that directs to your
						certificates.
					</span>
				</div>
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
						initialValues={editMOOCModel.initials}
						validationSchema={editMOOCModel.schema}
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
								<label className={classLabel} htmlFor='name'>
									MOOC Name
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

								<label className={classLabel} htmlFor='url'>
									MOOC URL
								</label>
								<input
									className={classInput}
									type='text'
									name='url'
									id='url'
									value={values.url}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.url && touched.url && errors.url}
								</span>

								<label className={classLabel} htmlFor='average_hours'>
									Average Hours
								</label>
								<input
									className={classInput}
									type='number'
									name='average_hours'
									id='average_hours'
									value={values.average_hours}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.average_hours &&
										touched.average_hours &&
										errors.average_hours}
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
									<span>{isSubmitting ? 'EDITING...' : 'EDIT'}</span>
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

	// console.log(bundle);

	return {
		props: {
			course_id,
			bundle_id,
			bundle: bundle ?? [],
		},
	};
}
