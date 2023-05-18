import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addCourseModel } from 'lib/yupmodels';
import axios from 'axios';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { useRouter } from 'next/router';
import { groupBy } from 'lodash';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import Tabs from '@components/Tabs';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function CoordinatorCoursePage({
	students,
	bundlesWB,
	bundlesWA,
	is_active,
	dictBundlesWB,
	dictBundlesWA,
}) {
	const Router = useRouter();
	const [selectedTabs, setSelectedTabs] = useState(0); // tabs

	const { course_id } = Router.query;

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

			await axios.post(`/api/coordinator/reject-bundle`, {
				course_id,
				bundle_id,
			});

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

			await axios.post(`/api/coordinator/reject-certificate`, {
				course_id,
				bundle_id,
				student_id,
			});

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

	const bundleSubAmount = Object.keys(dictBundlesWB)?.length;
	const certificateSubAmount = Object.keys(dictBundlesWA)?.length;

	const bundleSubTab = 'Student Bundle Submissions';
	const certificateSubTab = 'Student Certificate Submissions';

	const tabs = [
		{
			name: bundleSubTab,
			amount: bundleSubAmount,
		},
		{ name: certificateSubTab, amount: certificateSubAmount },
	];

	return (
		<div className='flex flex-col justify-center items-center'>
			<section className='w-full max-w-7xl px-2 py-4 sm:px-0 font-sans transition-all '>
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
							<span className='drop-shadow-md select-none '>
								Action Required Bundles
							</span>
						</div>
					</NextLink>
					<NextLink
						href={`/coordinator/courses/${course_id}/students`}
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
							<span className='drop-shadow-md select-none '>Students</span>
						</div>
					</NextLink>
				</div>
			</section>

			<Tabs {...{ selectedTabs, setSelectedTabs, tabs }} />

			{!is_active && (
				<div className='min-w-[95%] mt-4 mx-4 p-3 bg-gradient-to-t from-rose-100 to-rose-50 rounded-lg shadow-md text-3xl text-rose-600 text-center font-bold'>
					This is an inactive course!
				</div>
			)}

			{selectedTabs === 0 && (
				<div className='w-full'>
					{Object.keys(dictBundlesWB)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesWB).map(([key, value], i) => (
						<div
							key={i}
							className='
								max-w-7xl mx-auto 
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
			)}

			{selectedTabs === 1 && (
				<div className='w-full'>
					{Object.keys(dictBundlesWA)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesWA).map(([key, value], i) => (
						<div
							key={i}
							className='
								max-w-7xl mx-auto 
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

							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
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
			)}
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const token = req.cookies.token;
		const { course_id } = query;
		const backendURLwb = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-bundles`;
		const backendURLwa = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-approval`;

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
			},
		};
	}
}
