import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addCourseModel } from 'lib/yupmodels';
import axios from 'axios';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { useRouter } from 'next/router';
import { groupBy } from 'lodash';

const headers = [
	{
		title: 'Students',
		page: 'students',
	},
	{
		title: 'Waiting Bundles',
		page: 'bundlesWB',
	},
	{
		title: 'Waiting Certificates',
		page: 'bundlesWC',
	},
	{
		title: 'Waiting Approval',
		page: 'bundlesWA',
	},
	{
		title: 'Rejected Bundles',
		page: 'bundlesRB',
	},
	{
		title: 'Rejected Certificates',
		page: 'bundlesRC',
	},
	{
		title: 'Accepted Certificates',
		page: 'bundlesAC',
	},
];

const pageColorDict = {
	students: 'text-black',
	bundlesWB: 'text-blue-700',
	bundlesWC: 'text-sky-700',
	bundlesAC: 'text-emerald-700',
	bundlesWA: 'text-teal-700',
	bundlesRB: 'text-pink-700',
	bundlesRC: 'text-rose-700',
};

const pageDict = {
	students: 'Students',
	bundlesWB: 'Waiting Bundles',
	bundlesWC: 'Waiting Certificates',
	bundlesWA: 'Waiting Approval',
	bundlesRB: 'Rejected Bundles',
	bundlesRC: 'Rejected Certificates',
	bundlesAC: 'Accepted Certificates',
};

function MOOCHeaders({ setPage }) {
	return (
		<section className='w-full flex justify-between items-center gap-2 flex-wrap my-4'>
			{headers.map(({ title, page }, i) => (
				<button
					key={i}
					onClick={() => setPage(() => page)}
					className='
							px-4 py-2 
							bg-gradient-to-b from-neutral-50 to-neutral-200
							border-solid border-2 rounded-md
							border-neutral-200 hover:border-black
							ring-0 ring-offset-0 ring-neutral-200
							hover:ring-2 hover:ring-offset-4 hover:ring-black
							shadow-inner 
							cursor-pointer transition-all
						'
				>
					<span
						className={`select-none drop-shadow-md text-xl ${pageColorDict[page]}`}
					>
						{title}
					</span>
				</button>
			))}
		</section>
	);
}

export default function CoordinatorCoursePage({
	students,
	bundlesWB,
	bundlesRB,
	bundlesWC,
	bundlesWA,
	bundlesRC,
	bundlesAC,
	is_active,
	dictBundlesWB,
	dictBundlesRB,
	dictBundlesWC,
	dictBundlesWA,
	dictBundlesRC,
	dictBundlesAC,
}) {
	const Router = useRouter();
	const [page, setPage] = useState('students');

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

			await axios.post(`/api/coordinator/approve-certificates`, {
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

	const handleRejectCertificate = async (bundle_id) => {
		// alert(JSON.stringify({ course_id, bundle_id }, null, 2));

		try {
			if (bundle_id === 0) throw 'Please select a bundle';
			if (
				!confirm(
					'Are you sure about approving the certificates of this bundle?'
				)
			)
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/reject-certificates`, {
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
			<MOOCHeaders setPage={setPage} />
			{!is_active && (
				<div className='w-full mt-4 p-3 bg-rose-50 rounded-lg shadow-md text-3xl text-rose-600 text-center font-bold'>
					This is an inactive course!
				</div>
			)}
			<h1 className='text-center text-5xl mt-12 mb-4 drop-shadow-md'>
				{pageDict[page]}
			</h1>
			{page === 'students' && (
				<div className='max-w-7xl mx-auto  flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
					<table className='min-w-full border-solid border-0 border-b-2 border-collapse'>
						<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
							<tr>
								<th
									scope='col'
									className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
								>
									<span className='text-center drop-shadow-md'>Student No</span>
								</th>
								<th
									scope='col'
									className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
								>
									<span className='text-center drop-shadow-md'>Name</span>
								</th>
								<th
									scope='col'
									className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
								>
									<span className='text-center drop-shadow-md'>Email</span>
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200'>
							{!!students &&
								students.map(({ id, name, surname, email, student_no }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{student_no}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{name} {surname}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{email}
										</td>
									</tr>
								))}
							{students?.length === 0 && (
								<EmptyTableMessage
									cols={6}
									message='No students were found...'
								/>
							)}
						</tbody>
					</table>
				</div>
			)}
			{page === 'bundlesWB' && (
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
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
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
			{page === 'bundlesWC' && (
				<div className='w-full'>
					{Object.keys(dictBundlesWC)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesWC).map(([key, value], i) => (
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
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
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

							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								Accepted by {value[0]?.coordinator_name} at{' '}
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

							{/* <div className='my-4 flex justify-evenly items-center'>
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
							</div> */}
						</div>
					))}
				</div>
			)}

			{page === 'bundlesWA' && (
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
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
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

							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								Accepted by {value[0]?.coordinator_name} at{' '}
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
										onClick={() => handleRejectCertificate(key)}
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
			{page === 'bundlesRB' && (
				<div className='w-full'>
					{Object.keys(dictBundlesRB)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesRB).map(([key, value], i) => (
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
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
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
								Accepted by {value[0]?.coordinator_name} at{' '}
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
						</div>
					))}
				</div>
			)}
			{page === 'bundlesRC' && (
				<div className='w-full'>
					{Object.keys(dictBundlesRC)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesRC).map(([key, value], i) => (
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
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
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
								Accepted by {value[0]?.coordinator_name} at{' '}
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
						</div>
					))}
				</div>
			)}
			{page === 'bundlesAC' && (
				<div className='w-full'>
					{Object.keys(dictBundlesAC)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesRC).map(([key, value], i) => (
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
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
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
								Bundle accepted by {value[0]?.coordinator_name} at{' '}
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
							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								Approved by {value[0]?.coordinator_name} at{' '}
								{new Date(value[0]?.pass_date).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									timeZone: 'UTC',
								})}{' '}
								{new Date(value[0]?.pass_date).toLocaleTimeString('en-US', {
									timeZone: 'UTC',
								})}
							</div>
						</div>
					))}
				</div>
			)}
			{/* 
			
			
											<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
												<button
													onClick={() => handleDeactivate(id)}
													className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-rose-800 hover:bg-rose-600 border-none cursor-pointer transition-colors`}
												>
													X
												</button>
											</td>
											<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
												<NextLink href={`/coordinator/courses/${id}`}>
													<button className='text-center text-lg py-2 px-2 bg-blue-800 hover:bg-blue-600 shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
														GO
													</button>
												</NextLink>
											</td>
			
			<div
				className={`max-w-md md:max-w-2xl mx-auto mt-12 mb-2 md:px-6 transition-all shadow-lg border-solid border-neutral-200 hover:border-neutral-300 rounded-md `}
			>
				<Formik
					initialValues={addCourseModel.initials}
					validationSchema={addCourseModel.schema}
					onSubmit={handleAdd}
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
							<h2 className='md:col-span-2 mt-4 text-center text-3xl drop-shadow-md'>
								Add a new Course
							</h2>

							<label className={classLabel} htmlFor='course_code'>
								Course Code
							</label>
							<input
								className={classInput}
								type='text'
								name='course_code'
								id='course_code'
								value={values.course_code}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.course_code &&
									touched.course_code &&
									errors.course_code}
							</span>

							<label className={classLabel} htmlFor='name'>
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

							<label className={classLabel} htmlFor='semester'>
								Semester
							</label>
							<select
								name='semester'
								id='semester'
								className={classInput}
								value={values.semester}
								onChange={(e) => {
									setFieldValue('semester', e.target.value);
								}}
							>
								<option value={0}>None</option>
								{!!semesters &&
									semesters.map((semester, i) => (
										<option key={i} value={semester}>
											{semester}
										</option>
									))}
							</select>
							<span className={classError}>
								{errors.semester && touched.semester && errors.semester}
							</span>

							<label className={classLabel} htmlFor='credits'>
								Credits
							</label>
							<input
								className={classInput}
								type='text'
								name='credits'
								id='credits'
								value={values.credits}
								onChange={handleChange}
							/>
							<span className={classError}>
								{errors.credits && touched.credits && errors.credits}
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
								<span>{isSubmitting ? 'Adding...' : 'Add Course'}</span>
							</button>
						</form>
					)}
				</Formik>
			</div> */}
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const token = req.cookies.token;
		const { course_id } = query;
		const backendURLst = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/students`;
		const backendURLwb = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-bundles`;
		const backendURLrb = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/rejected-bundles`;
		const backendURLwc = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-certificates`;
		const backendURLwa = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-approval`;
		const backendURLrc = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/rejected-certificates`;
		const backendURLac = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/accepted-certificates`;

		const { data: dataST } = await axios.get(backendURLst, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataWB } = await axios.get(backendURLwb, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataRB } = await axios.get(backendURLrb, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataWC } = await axios.get(backendURLwc, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataWA } = await axios.get(backendURLwa, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataRC } = await axios.get(backendURLrc, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataAC } = await axios.get(backendURLac, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { students } = dataST;
		const { bundles: bundlesWB, is_active } = dataWB;
		const { bundles: bundlesRB } = dataRB;
		const { bundles: bundlesWC } = dataWC;
		const { bundles: bundlesWA } = dataWA;
		const { bundles: bundlesRC } = dataRC;
		const { bundles: bundlesAC } = dataAC;

		const dictBundlesWB = groupBy(bundlesWB, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesRB = groupBy(bundlesRB, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesWC = groupBy(bundlesWC, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesWA = groupBy(bundlesWA, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesRC = groupBy(bundlesRC, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesAC = groupBy(bundlesAC, (bundle) => {
			return bundle.bundle_id;
		});

		return {
			props: {
				students,
				bundlesWB,
				bundlesRB,
				bundlesWC,
				bundlesWA,
				bundlesRC,
				bundlesAC,
				is_active,
				dictBundlesWB,
				dictBundlesRB,
				dictBundlesWC,
				dictBundlesWA,
				dictBundlesRC,
				dictBundlesAC,
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				students: [],
				bundlesWB: [],
				bundlesRB: [],
				bundlesWC: [],
				bundlesWA: [],
				bundlesRC: [],
				bundlesAC: [],
				is_active: false,
				dictBundlesWB: {},
				dictBundlesRB: {},
				dictBundlesWC: {},
				dictBundlesWA: {},
				dictBundlesRC: {},
				dictBundlesAC: {},
			},
		};
	}
}
