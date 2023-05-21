import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { editBundleFeedbackModel, editBundleMoocAddModel } from 'lib/yupmodels';
import axios from 'axios';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { useRouter } from 'next/router';
import { groupBy } from 'lodash';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import {
	UsersIcon,
	UserMinusIcon,
	PencilSquareIcon,
	TrashIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import Tabs from '@components/Tabs';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import Multiselect from 'multiselect-react-dropdown';
import { notify } from 'utils/notify';
import { BsChevronCompactDown } from 'react-icons/bs';

export default function CoordinatorCoursePage({
	bundlesWB,
	bundlesWA,
	is_active,
	dictBundlesWB,
	dictBundlesWA,
	moocs,
	mooc_details,
	course,
	students,
	waiting_students,
}) {
	const Router = useRouter();
	const [selectedTabs, setSelectedTabs] = useState(0); // tabs
	const [selectedModalTab, setSelectedModalTab] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedMooc, setSelectedMooc] = useState([]);
	const [selected, setSelected] = useState(0);
	const [selectedBundle, setSelectedBundle] = useState([
		{
			bundle_id: '',
			student_id: '',
			student_no: '',
			student_name: '',
			student_surname: '',
			mooc_name: '',
			mooc_url: '',
			certificate_url: '',
			bundle_created_at: '',
		},
	]);

	const { course_id } = Router.query;

	const getBundleDetails = async (bundle_id) => {
		try {
			const { data } = await axios.get(`/api/coordinator/get-bundle`, {
				params: {
					course_id,
					bundle_id,
				},
			});

			const bundle = data?.bundle;

			setSelectedBundle(bundle);
			openModal();
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

	function openModal() {
		setIsOpen(true);
	}
	function closeModal() {
		setIsOpen(false);
	}

	const handleApproveBundle = async (bundle_id) => {
		// alert(JSON.stringify({ course_id, bundle_id }, null, 2));

		try {
			if (bundle_id === 0) throw 'Please select a bundle';
			if (!confirm('Are you sure about approving this bundle?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/approve-bundle`, {
				course_id,
				bundle_id,
			});

			notify('success', 'Bundle approved successfully');
			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const handleRejectBundle = async (bundle_id) => {
		// alert(JSON.stringify({ course_id, bundle_id }, null, 2));

		try {
			if (bundle_id === 0) throw 'Please select a bundle';
			if (!confirm('Are you sure about approving this bundle?'))
				throw new Error('Action refused by user');

			const message = prompt(
				'Please enter a message to the student about rejection reason'
			);

			if (!message) throw new Error('Message is required');

			if (message.length > 2000)
				throw new Error('Message is too long, max 2000 chars');

			await axios.post(`/api/coordinator/reject-bundle`, {
				course_id,
				reason: message,
				bundle_id,
			});

			notify('success', 'Bundle rejected successfully');
			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const handleApproveCertificate = async (bundle_id, student_id) => {
		// alert(JSON.stringify({ course_id, bundle_id }, null, 2));

		try {
			if (bundle_id === 0) throw 'Please select a bundle';
			if (
				!confirm(
					'Are you sure about approving the certificates of this bundle?'
				)
			)
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/approve-certificate`, {
				course_id,
				bundle_id,
				student_id,
			});

			notify('success', 'Certificate approved successfully');
			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const handleRejectCertificate = async (bundle_id, student_id) => {
		// alert(JSON.stringify({ course_id, bundle_id }, null, 2));

		try {
			if (bundle_id === 0) throw 'Please select a bundle';
			if (
				!confirm(
					'Are you sure about approving the certificates of this bundle?'
				)
			)
				throw new Error('Action refused by user');

			const message = prompt(
				'Please enter a message to the student about rejection reason'
			);

			if (!message) throw new Error('Message is required');

			if (message.length > 2000)
				throw new Error('Message is too long, max 2000 chars');

			await axios.post(`/api/coordinator/reject-certificate`, {
				course_id,
				bundle_id,
				reason: message,
				student_id,
			});

			notify('success', 'Certificate rejected successfully');
			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const handleAddMooc = async (values, { setSubmitting }) => {
		try {
			const { data } = await axios.post(`/api/coordinator/add-bundle-mooc`, {
				course_id,
				bundle_id: selected,
				mooc_id: selectedMooc[0].id,
			});

			notify('success', 'MOOC added successfully');

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
			setSelectedMooc([]);
			setSubmitting(false);
		}
	};

	const handleDeleteMooc = async (bundle_detail_id) => {
		try {
			if (!confirm('Are you sure about removing this MOOC?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/remove-bundle-mooc`, {
				course_id,
				bundle_id: selected,
				bundle_detail_id,
			});

			notify('success', 'MOOC removed successfully');

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

	const handleEditCertificate = async (bundle_detail_id) => {
		try {
			const certificate_url = prompt('Please enter the new certificate url');

			// if (!certificate_url) throw new Error('Certificate url is required');

			await axios.post(`/api/coordinator/edit-certificate`, {
				course_id,
				bundle_id: selected,
				bundle_detail_id,
				certificate_url,
			});

			notify('success', 'Certificate url updated successfully');

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

	const handleCommentChange = async ({ comment }, { setSubmitting }) => {
		try {
			if (!comment) throw new Error('Comment is required');

			if (comment.length > 2000)
				throw new Error('Comment is too long, max 2000 chars');

			await axios.post(`/api/coordinator/edit-feedback`, {
				course_id,
				bundle_id: selected,
				comment,
			});

			notify('success', 'Feedback updated successfully');

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
	};

	const handleApprove = async (student_id) => {
		try {
			if (!confirm('Are you sure about approving this enrollment?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/approve-enrollment`, {
				course_id,
				student_id,
			});

			notify('success', 'Enrollment approved successfully');
			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const handleReject = async (student_id) => {
		try {
			if (!confirm('Are you sure about rejecting this enrollment?'))
				throw new Error('Action refused by user');

			const message = prompt(
				'Please enter a message to the student about rejection reason'
			);

			if (!message) throw new Error('Message is required');

			if (message.length > 2000)
				throw new Error('Message is too long, max 2000 chars');

			await axios.post(`/api/coordinator/reject-enrollment`, {
				course_id,
				message,
				student_id,
			});

			notify('success', 'Enrollment rejected successfully');
			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const handleSelect = (selectedList, selectedItem) => {
		try {
			if (
				Object.values(selectedMooc)
					.map(({ id }) => id)
					.includes(selectedItem.id)
			) {
				notify('warning', 'Already added the selected MOOC');
				return;
			}
			setSelectedMooc(() => [selectedItem]);
		} catch (error) {
			notify('error', 'Error adding MOOC');
		}
	};

	const handleRemove = (selectedList, selectedItem) => {
		try {
			setSelectedMooc(() =>
				selectedMooc.filter((item) => item.id !== selectedItem.id)
			);
		} catch (error) {
			notify('error', 'Error removing MOOC');
		}
	};

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

	const enrollAwaitAmount = Object.keys(waiting_students)?.length;
	const bundleSubAmount = Object.keys(dictBundlesWB)?.length;
	const certificateSubAmount = Object.keys(dictBundlesWA)?.length;

	const enrollAwaitSubTab = 'Students Awaiting Enrollment Approval';
	const bundleSubTab = 'Student Bundle Submissions';
	const certificateSubTab = 'Student Certificate Submissions';

	const tabs = [
		{ name: enrollAwaitSubTab, amount: enrollAwaitAmount },
		{
			name: bundleSubTab,
			amount: bundleSubAmount,
		},
		{ name: certificateSubTab, amount: certificateSubAmount },
	];

	return (
		<div className='flex flex-col justify-center items-center'>
			<span className='text-center text-2xl font-bold mt-4'>
				{course.course_code} {course.name}
			</span>

			<span className='text-center text-xl font-semibold mt-2'>
				{course.semester} ({course.credits} credits)
			</span>

			{!is_active && (
				<div className='min-w-[95%] my-4 mx-4 p-3 bg-gradient-to-t from-rose-100 to-rose-50 rounded-lg shadow-md text-3xl text-rose-600 text-center font-bold'>
					This is an inactive course!
				</div>
			)}

			<section className='w-[95%] px-2 py-4 sm:px-0 font-sans transition-all '>
				<div className='flex space-x-1 rounded-xl bg-zinc-200/[0.8]  p-1'>
					<NextLink
						href={`/coordinator/courses/${course_id}/reports`}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								false
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<div>
							<span className='drop-shadow-md select-none '>Reports</span>
						</div>
					</NextLink>
					<NextLink
						href={`/coordinator/courses/${course_id}`}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								true
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<div>
							<span className='drop-shadow-md select-none '>Actions</span>
						</div>
					</NextLink>
				</div>
			</section>

			<Tabs {...{ selectedTabs, setSelectedTabs, tabs, fullWidth: false }} />

			{selectedTabs === 0 && (
				<div className='flex flex-col overflow-x-auto w-[95%] align-middle overflow-hidden border shadow-lg'>
					<KTable>
						<KTableHead
							tableHeaders={[
								{
									name: 'Student No',
									alignment: 'left',
									className: 'rounded-tl-md',
								},
								{ name: 'Name', alignment: 'left' },
								{ name: 'Email', alignment: 'left' },
								{
									name: 'Previous Courses',
									alignment: 'center',
								},
								{
									name: 'Actions',
									alignment: 'center',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{!!waiting_students &&
								Object.entries(waiting_students).map(([key, value], idx) => (
									<tr
										key={key}
										className={
											idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
										}
									>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{value[0]?.student_no}
										</td>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{value[0]?.name} {value[0]?.surname}
										</td>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{value[0]?.email}
										</td>
										<td className='px-4 py-4 text-lg font-medium '>
											{(value?.length === 0 ||
												(value?.length === 1 && !value[0]?.course_id)) && (
												<div className='mr-1 font-bold text-center rounded-xl text-rose-500'>
													<span className='drop-shadow-lg'>
														There are no previous courses
													</span>
												</div>
											)}
											{console.log(value)}
											{value?.map(
												(
													{
														pass_date,
														course_code,
														course_name,
														course_id,
														credits,
														semester,
														is_course_active,
														is_passed_course,
														is_waiting_enrollment,
													},
													index
												) => (
													<div key={index}>
														{course_id && (
															<div className='grid grid-cols-3 gap-y-4'>
																<div className='w-full'>
																	{!is_course_active ? (
																		is_passed_course ? (
																			<div className='mr-1 font-bold text-center rounded-xl text-white bg-green-500'>
																				<span className='drop-shadow-lg'>
																					PASSED COURSE
																				</span>
																			</div>
																		) : (
																			<div className='mr-1 font-bold text-center rounded-xl text-white bg-rose-500'>
																				<span className='drop-shadow-lg'>
																					FAILED COURSE
																				</span>
																			</div>
																		)
																	) : is_passed_course ? (
																		<div className='mr-1 font-bold text-center rounded-xl text-white bg-green-500'>
																			<span className='drop-shadow-lg'>
																				PASSED COURSE
																			</span>
																		</div>
																	) : is_waiting_enrollment ? (
																		<div className='mr-1 font-bold text-center rounded-xl text-white bg-yellow-500'>
																			<span className='drop-shadow-lg'>
																				IN WAITING LIST
																			</span>
																		</div>
																	) : (
																		<div className='mr-1 font-bold text-center rounded-xl text-white bg-sky-500'>
																			<span className='drop-shadow-lg'>
																				CURRENTLY ENROLLED
																			</span>
																		</div>
																	)}
																</div>
																<div className='mb-1 col-span-2'>
																	{course_code} {course_name}
																	{', '}
																	{semester} ({credits} credits)
																	{!!pass_date && (
																		<div>Pass Date: {pass_date}</div>
																	)}
																</div>
															</div>
														)}
													</div>
												)
											)}
										</td>
										<td className='px-4 py-4 text-lg font-medium text-center'>
											<div className='my-4 flex flex-col gap-4 justify-evenly items-center'>
												<button
													onClick={() => handleReject(key)}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-rose-500 bg-rose-700 text-rose-50 transition-colors'
												>
													<span className='drop-shadow-md select-none'>
														Reject
													</span>
												</button>
												<button
													onClick={() => handleApprove(key)}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-emerald-500 bg-emerald-700 text-emerald-50 transition-colors'
												>
													<span className='drop-shadow-md select-none'>
														Approve
													</span>
												</button>
											</div>
										</td>
									</tr>
								))}
							{Object.keys(waiting_students)?.length === 0 && (
								<EmptyTableMessage
									cols={4}
									message='No waiting students were found...'
								/>
							)}
						</KTableBody>
					</KTable>
				</div>
			)}

			{selectedTabs === 1 && (
				<div className='w-[95%]'>
					<KTable className=''>
						<KTableHead
							tableHeaders={[
								{
									name: 'Student Name',
									alignment: 'left',
									className: 'rounded-tl-md',
								},
								{
									name: 'Student No',
									alignment: 'left',
								},
								{
									name: 'Chosen MOOCs',
									alignment: 'center',
									className: '',
								},
								{
									name: 'Total Hours',
									alignment: 'center',
									className: '',
								},
								{
									name: 'Edit Bundle',
									alignment: 'center',
									className: '',
								},
								{
									name: 'Actions',
									alignment: 'center',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{Object.entries(dictBundlesWB).map(([key, value], idx) => (
								<tr
									key={idx}
									className={
										idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
									}
								>
									<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
										<div className='flex flex-col justify-center items-start'>
											<span className='font-normal'>
												{value[0]?.student_name} {value[0]?.student_surname}
											</span>
										</div>
									</td>
									<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
										<div className='flex flex-col justify-center items-start'>
											<span className=''>{value[0]?.student_no}</span>
										</div>
									</td>
									<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
										{value?.map(
											(
												{
													bundle_id,
													student_id,
													student_no,
													student_name,
													student_surname,
													mooc_name,
													mooc_url,
													certificate_url,
													bundle_created_at,
												},
												index
											) => (
												<div
													key={index}
													className='mt-2 py-1 w-full grid grid-cols-4 '
												>
													<NextLink
														href={mooc_url ?? ''}
														target='_blank'
														className='col-span-3'
													>
														<span className='select-none text-black no-underline'>
															-&gt;
														</span>{' '}
														<span className='text-blue-600 hover:underline underline-offset-2'>
															{mooc_name}
														</span>
													</NextLink>

													{!!certificate_url && (
														<NextLink
															href={certificate_url ?? ''}
															target='_blank'
															className='font-semibold text-indigo-600/[0.65] hover:underline underline-offset-2 '
														>
															Certificate
														</NextLink>
													)}
												</div>
											)
										)}
									</td>
									<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap text-center '>
										{value
											.map(({ average_hours }) => average_hours)
											.reduce((partialSum, a) => partialSum + a, 0)}
									</td>
									<td className=' text-center  px-4 py-4 text-lg font-medium whitespace-nowrap '>
										{!!is_active && (
											<button
												onClick={() => {
													setSelected(key);
													getBundleDetails(key);
												}}
												className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
											>
												<PencilSquareIcon className='h-7 w-7 text-zinc-700' />
											</button>
										)}
									</td>
									<td className='   px-4 py-4 text-lg font-medium whitespace-nowrap '>
										{!!is_active && (
											<div className='my-4 flex flex-col gap-4 justify-evenly items-center'>
												<button
													onClick={() => handleRejectBundle(key)}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-rose-500 bg-rose-700 text-rose-50 transition-colors'
												>
													<span className='drop-shadow-md'>Reject</span>
												</button>
												<button
													onClick={() => handleApproveBundle(key)}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-emerald-500 bg-emerald-700 text-emerald-50 transition-colors'
												>
													<span className='drop-shadow-md'>Approve</span>
												</button>
											</div>
										)}
									</td>
								</tr>
							))}
							{Object.keys(dictBundlesWB)?.length === 0 && (
								<EmptyTableMessage
									cols={6}
									message='No submissions were found...'
								/>
							)}
						</KTableBody>
					</KTable>
				</div>
			)}

			{/* {selectedTabs === 0 && (
				<div className='w-[95%]'>
					{Object.keys(dictBundlesWB)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesWB).map(([key, value], i) => (
						<div
							key={i}
							className='
								w-full
								mt-4 mb-8 p-2 hover:mb-12
								flex flex-col
								bg-slate-100 rounded-lg
								border-solid border-2
								border-slate-200 hover:border-slate-300
								shadow-lg hover:shadow-2xl
								transition-all
							'
						>
							<div className='-mt-6 -ml-6 max-w-max h-8 px-3 flex justify-center items-center rounded-full bg-teal-200 shadow-lg text-xl font-bold'>
								<span className='font-semibold'>{value[0]?.student_no}</span>
								<span className='font-normal ml-2'>
									{value[0]?.student_name} {value[0]?.student_surname}
								</span>
							</div>

							{value?.map(
								(
									{
										bundle_id,
										student_no,
										student_name,
										student_surname,
										mooc_name,
										mooc_url,
										certificate_url,
										bundle_created_at,
									},
									index
								) => (
									<div
										key={index}
										className='
											mt-2 p-1 w-full
											grid grid-cols-4 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className='col-span-3'>
											<span className='select-none text-black no-underline'>
												-&gt;
											</span>
											<span className='text-blue-600 hover:underline underline-offset-2'>
												{mooc_name}
											</span>
										</NextLink>

										{!!certificate_url && (
											<NextLink
												href={certificate_url ?? ''}
												className='ml-4 font-semibold text-indigo-600 hover:underline underline-offset-2'
											>
												Certificate
											</NextLink>
										)}
									</div>
								)
							)}

							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								{new Date(value[0]?.bundle_created_at).toLocaleDateString(
									'en-US',
									{
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										timeZone: 'UTC',
									}
								)}{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleTimeString(
									'en-US',
									{
										timeZone: 'UTC',
									}
								)}
							</div>

							{!!is_active && (
								<div className='my-4 flex justify-evenly items-center'>
									<button
										onClick={() => handleRejectBundle(key)}
										className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-rose-500 bg-rose-700 text-rose-50 transition-colors'
									>
										<span className='drop-shadow-md'>Reject</span>
									</button>
									<button
										onClick={() => handleApproveBundle(key)}
										className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-emerald-500 bg-emerald-700 text-emerald-50 transition-colors'
									>
										<span className='drop-shadow-md'>Approve</span>
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			)} */}

			{selectedTabs === 2 && (
				<div className='w-[95%]'>
					<KTable className=''>
						<KTableHead
							tableHeaders={[
								{
									name: 'Student',
									alignment: 'left',
									className: 'rounded-tl-md',
								},
								{
									name: 'MOOCs & Certificates',
									alignment: 'center',
									className: '',
								},
								{
									name: 'Bundle Feedback of Student',
									alignment: 'center',
									className: 'max-w-xs',
								},
								{
									name: 'Student Completion Date',
									alignment: 'center',
								},
								{
									name: 'Edit Bundle',
									alignment: 'center',
									className: '',
								},
								{
									name: 'Actions',
									alignment: 'center',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{Object.entries(dictBundlesWA).map(([key, value], idx) => (
								<tr
									key={idx}
									className={
										idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
									}
								>
									<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
										<div className='flex flex-col justify-start items-start'>
											<span className='font-normal'>
												{value[0]?.student_name} {value[0]?.student_surname}
											</span>
											<span className='font-semibold'>
												{value[0]?.student_no}
											</span>
										</div>
									</td>
									<td className='px-4 py-4 text-lg font-medium '>
										{value?.map(
											(
												{
													bundle_id,
													student_no,
													student_name,
													student_surname,
													mooc_name,
													mooc_url,
													certificate_url,
													bundle_created_at,
												},
												index
											) => (
												<div
													key={index}
													className='mt-2 py-1 w-full grid grid-cols-4 '
												>
													<NextLink
														href={mooc_url ?? ''}
														target='_blank'
														className='col-span-3'
													>
														<span className='select-none text-black no-underline'>
															-&gt;
														</span>{' '}
														<span className='text-blue-600 hover:underline underline-offset-2'>
															{mooc_name}
														</span>
													</NextLink>

													{!!certificate_url && (
														<NextLink
															href={certificate_url ?? ''}
															target='_blank'
															className='font-semibold text-indigo-600/[0.65] hover:underline underline-offset-2 '
														>
															Certificate
														</NextLink>
													)}
												</div>
											)
										)}
									</td>
									<td className='max-w-xs px-4 py-4 text-lg font-medium  '>
										<div className=' max-w-max mt-2 px-2 text-justify text-neutral-700 '>
											{value[0]?.comment}
											{console.log(value)}
										</div>
									</td>
									<td className='px-4 py-4 text-lg font-medium text-center '>
										{value[0]?.complete_date &&
											new Date(value[0]?.complete_date).toLocaleDateString(
												'en-US',
												{
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													timeZone: 'UTC',
												}
											)}
										{value[0]?.complete_date && ', '}
										{value[0]?.complete_date &&
											new Date(value[0]?.complete_date).toLocaleTimeString(
												'en-US',
												{
													timeZone: 'UTC',
												}
											)}
										{!value[0]?.complete_date && 'Date not found'}
									</td>

									<td className=' text-center  px-4 py-4 text-lg font-medium whitespace-nowrap '>
										{!!is_active && (
											<button
												onClick={() => {
													setSelected(key);
													getBundleDetails(key);
												}}
												className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
											>
												<PencilSquareIcon className='h-7 w-7 text-zinc-700' />
											</button>
										)}
									</td>
									<td className='   px-4 py-4 text-lg font-medium whitespace-nowrap '>
										{!!is_active && (
											<div className='my-4 flex flex-col gap-4 justify-evenly items-center'>
												<button
													onClick={() =>
														handleRejectCertificate(key, value[0]?.student_id)
													}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-rose-500 bg-rose-700 text-rose-50 transition-colors'
												>
													<span className='drop-shadow-md select-none'>
														Reject
													</span>
												</button>
												<button
													onClick={() =>
														handleApproveCertificate(key, value[0]?.student_id)
													}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-emerald-500 bg-emerald-700 text-emerald-50 transition-colors'
												>
													<span className='drop-shadow-md select-none'>
														Approve
													</span>
												</button>
											</div>
										)}
									</td>
								</tr>
							))}
							{Object.keys(dictBundlesWA)?.length === 0 && (
								<EmptyTableMessage
									cols={6}
									message='No submissions were found...'
								/>
							)}
						</KTableBody>
					</KTable>
				</div>
			)}

			{/* {selectedTabs === 1 && (
				<div className='w-[95%]'>
					{Object.keys(dictBundlesWA)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesWA).map(([key, value], i) => (
						<div
							key={i}
							className='
								w-full
								mt-4 mb-8 p-2 hover:mb-12
								flex flex-col
								bg-slate-100 rounded-lg
								border-solid border-2
								border-slate-200 hover:border-slate-300
								shadow-lg hover:shadow-2xl
								transition-all
							'
						>
							<div className='-mt-6 -ml-6 max-w-max h-8 px-3 flex justify-center items-center rounded-full bg-teal-200 shadow-lg text-xl font-bold'>
								<span className='font-semibold'>{value[0]?.student_no}</span>
								<span className='font-normal ml-2'>
									{value[0]?.student_name} {value[0]?.student_surname}
								</span>
							</div>

							{value?.map(
								(
									{
										bundle_id,
										student_no,
										student_name,
										student_surname,
										mooc_name,
										mooc_url,
										certificate_url,
										bundle_created_at,
									},
									index
								) => (
									<div
										key={index}
										className='
											mt-2 p-1 w-full
											grid grid-cols-4 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className='col-span-3'>
											<span className='select-none text-black no-underline'>
												-&gt;
											</span>
											<span className='text-blue-600 hover:underline underline-offset-2'>
												{mooc_name}
											</span>
										</NextLink>

										{!!certificate_url ? (
											<NextLink
												href={certificate_url ?? ''}
												className='ml-4 font-semibold text-indigo-600 hover:underline underline-offset-2'
											>
												Certificate
											</NextLink>
										) : (
											<span className='text-neutral-600'>
												No certificate was found...
											</span>
										)}
									</div>
								)
							)}

							<div className='max-w-4xl mx-auto mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								<span className='font-semibold'>
									Bundle Feedback of Student
								</span>
							</div>

							<div className='max-w-4xl mx-auto mt-2 px-2 text-justify text-neutral-700 drop-shadow-md'>
								{value[0]?.comment}
							</div>

							<div className='mt-6 px-2 text-center text-neutral-700 drop-shadow-md'>
								Accepted by{' '}
								<span className='font-semibold'>
									Coordinator {value[0]?.coordinator_name} at
								</span>{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleDateString(
									'en-US',
									{
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										timeZone: 'UTC',
									}
								)}{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleTimeString(
									'en-US',
									{
										timeZone: 'UTC',
									}
								)}
							</div>

							{!!is_active && (
								<div className='my-4 flex justify-evenly items-center'>
									<button
										onClick={() =>
											handleRejectCertificate(key, value[0]?.student_id)
										}
										className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-rose-500 bg-rose-700 text-rose-50 transition-colors'
									>
										<span className='drop-shadow-md'>Reject</span>
									</button>
									<button
										onClick={() =>
											handleApproveCertificate(key, value[0]?.student_id)
										}
										className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-emerald-500 bg-emerald-700 text-emerald-50 transition-colors'
									>
										<span className='drop-shadow-md'>Approve</span>
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			)} */}

			<Modal
				{...{
					isOpen,
					setIsOpen,
					closeModal,
					openModal,
				}}
				title='Edit selected bundle'
				extraLarge={true}
			>
				<div className={`transition-all mt-2 `}>
					{/* <section className='w-[95%] px-2 py-4 sm:px-0 font-sans transition-all '>
						<div className='flex space-x-1 rounded-xl bg-zinc-200/[0.8]  p-1'>
							<div
								onClick={() => setSelectedModalTab(0)}
								className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								selectedModalTab === 0
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
							>
								<div>
									<span className='drop-shadow-md select-none '>
										View MOOCs
									</span>
								</div>
							</div>
							<div
								onClick={() => setSelectedModalTab(1)}
								className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								selectedModalTab === 1
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
							>
								<div>
									<span className='drop-shadow-md select-none '>
										Add a MOOC
									</span>
								</div>
							</div>
							<div
								onClick={() => setSelectedModalTab(2)}
								className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								selectedModalTab === 2
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
							>
								<div>
									<span className='drop-shadow-md select-none '>
										Change Bundle Feedback
									</span>
								</div>
							</div>
						</div>
					</section> */}

					<div className='flex flex-col items-center justify-center'>
						<div className='w-full text-lg flex justify-evenly items-center gap-1 my-2'>
							<span>
								<span className='font-semibold'>Name:</span>{' '}
								{selectedBundle[0]?.student_name}{' '}
								{selectedBundle[0]?.student_surname}
							</span>
							<span>
								<span className='font-semibold'>Student No: </span>
								{selectedBundle[0]?.student_no}
							</span>
							<span>
								<span className='font-semibold'>Email: </span>
								{selectedBundle[0]?.student_email}
							</span>
						</div>
						{/* <div className='grid grid-cols-1 gap-2 my-4'>
								{Object.entries(selectedBundle[0] ?? {}).map(
									([key, value], index) => (
										<div key={index} className='grid grid-cols-2 gap-1'>
											<span>{key}:</span>
											<span>{value ?? '-'}</span>
										</div>
									)
								)}
							</div> */}
					</div>

					{selectedModalTab === 0 && (
						<div className='mt-2 w-full overflow-x-auto'>
							<KTable>
								<KTableHead
									tableHeaders={
										selectedTabs === 0
											? [
													{
														name: 'MOOC',
														alignment: 'left',
														className: 'rounded-tl-md rounded-tr-md',
													},
											  ]
											: [
													{
														name: 'MOOC',
														alignment: 'left',
														className: 'rounded-tl-md',
													},
													{ name: 'Certificate', alignment: 'left' },
													{
														name: 'Change Certificate URL',
														alignment: 'center',
														className: 'rounded-tr-md',
													},
											  ]
									}
								></KTableHead>
								<KTableBody>
									{selectedBundle.map((bundle, idx) => (
										<tr
											key={idx}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className='px-4 py-2'>
												<MdDeleteForever
													size={24}
													onClick={() =>
														handleDeleteMooc(bundle.bundle_detail_id)
													}
													className=' drop-shadow-md align-bottom text-red-700 cursor-pointer mr-2'
												/>
												{bundle.mooc_name}
											</td>
											{selectedTabs !== 0 && (
												<>
													<td className='px-4 py-2'>
														{bundle?.certificate_url && (
															<NextLink
																href={bundle.certificate_url}
																target='_blank'
																className='text-blue-500'
															>
																{bundle.certificate_url}
															</NextLink>
														)}
													</td>
													<td className='px-4 py-2'>
														<div className='flex justify-center'>
															<button
																onClick={() =>
																	handleEditCertificate(bundle.bundle_detail_id)
																}
																className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
															>
																<PencilSquareIcon className='h-7 w-7 text-zinc-700' />
															</button>
														</div>
													</td>
												</>
											)}
										</tr>
									))}
								</KTableBody>
							</KTable>
						</div>
					)}

					{selectedModalTab === 0 && (
						<Formik
							initialValues={editBundleMoocAddModel.initials}
							validationSchema={editBundleMoocAddModel.schema}
							onSubmit={handleAddMooc}
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
									className={`grid grid-cols-1 md:grid-cols-4 gap-2 content-center place-content-center px-4 mb-8`}
								>
									<label className={classLabel} htmlFor='addmooc'>
										Add a MOOC
									</label>
									<div
										name='addmooc'
										id='addmooc'
										className='col-span-3 flex flex-col justify-center overflow-visible'
									>
										<Multiselect
											className='w-full '
											options={moocs} // Options to display in the dropdown
											selectedValues={selectedMooc} // Preselected value to persist in dropdown
											onSelect={handleSelect} // Function will trigger on select event
											onRemove={handleRemove} // Function will trigger on remove event
											displayValue='name' // Property name to display in the dropdown options
											placeholder='Select a MOOC'
											style={{
												chips: {
													padding: '0.5rem 1rem',
													background: '#212021',
													borderRadius: '4rem',
													color: '#f2f2f2',
													fontSize: '1rem',
												},
												multiselectContainer: {
													color: '#212021',
													fontSize: '1rem',
												},
												searchBox: {
													padding: '0.5rem',
													color: '#f2f2f2',
													border: '1px solid #212021',
													borderBottom: '1px solid #212021',
													borderRadius: '5px',
													fontSize: '1rem',
												},
												inputField: {
													fontSize: '1rem',
												},
												option: {
													border: 'none',
													borderBottom: '1px solid #ccc',
													borderRadius: '0',
												},
											}}
										/>
									</div>

									<button
										variant='contained'
										color='primary'
										size='large'
										type='submit'
										className={`mx-auto my-4 col-span-1 tracking-wider text-center text-xl py-1 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
										disabled={isSubmitting}
									>
										<div
											className={`inline-block rounded-sm bg-purple-500 ${
												isSubmitting && 'w-4 h-4 mr-2 animate-spin'
											}`}
										></div>
										<span>{isSubmitting ? 'ADDING...' : 'ADD MOOC'}</span>
									</button>
								</form>
							)}
						</Formik>
					)}

					{selectedModalTab === 0 && (
						<Formik
							initialValues={{ comment: selectedBundle[0].comment }}
							validationSchema={editBundleFeedbackModel.schema}
							onSubmit={handleCommentChange}
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
									{/* <label className={classLabel} htmlFor='name'>
								Name
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
							/>
							<span className={classError}>
								{errors.surname && touched.surname && errors.surname}
							</span> */}

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
										<span>{isSubmitting ? 'Editing...' : 'EDIT FEEDBACK'}</span>
									</button>
								</form>
							)}
						</Formik>
					)}
				</div>
			</Modal>
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const token = req.cookies.token;
		const { course_id } = query;
		const backendURLwb = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-bundles`;
		const backendURLwa = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-approval`;

		const backendURLmo = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/moocs`;

		const { data: dataWB } = await axios.get(backendURLwb, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataWA } = await axios.get(backendURLwa, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataMo } = await axios.get(backendURLmo, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const backendURLco = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/info`;

		const { data: dataCo } = await axios.get(backendURLco, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { course } = dataCo;

		const backendURLst = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/students`;
		const backendURLen = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-students`;

		const { data: dataST } = await axios.get(backendURLst, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataEN } = await axios.get(backendURLen, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { students } = dataST;
		const { students: waiting_students_raw } = dataEN;

		const waiting_students = groupBy(waiting_students_raw, (student) => {
			return student.student_id;
		});

		const { moocs } = dataMo;

		const mooc_details = {};

		moocs?.forEach(({ id, name, url, average_hours }, index) => {
			mooc_details[id] = { id, name, url, average_hours };
		});

		const { bundles: bundlesWB, is_active } = dataWB;
		const { bundles: bundlesWA } = dataWA;

		const dictBundlesWB = groupBy(bundlesWB, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesWA = groupBy(bundlesWA, (bundle) => {
			return bundle.bundle_id;
		});

		return {
			props: {
				bundlesWB,
				bundlesWA,
				is_active,
				dictBundlesWB,
				dictBundlesWA,
				moocs,
				mooc_details,
				course,
				students,
				waiting_students,
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				bundlesWB: [],
				bundlesWA: [],
				is_active: true,
				dictBundlesWB: {},
				dictBundlesWA: {},
				moocs: [],
				mooc_details: {},
				course: {},
				students: [],
				waiting_students: [],
			},
		};
	}
}
