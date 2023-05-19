import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
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
} from '@heroicons/react/24/solid';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import Tabs from '@components/Tabs';

const bundleStatus = {
	'Waiting Bundle': 'Bundle waiting for approval',
	'Waiting Approval': 'Certificates waiting for approval',
	'Waiting Certificates': 'Upload your certificates',
	'Rejected Bundle': 'Bundle rejected',
	'Rejected Certificates': 'Certificates rejected',
	'Accepted Certificates': 'Certificates accepted',
};

export default function CourseBundlesPage({
	course_id,
	bundles,
	bundleDetails,
}) {
	const Router = useRouter();

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Your Bundles</PageTitle>

			<div className='max-w-7xl mx-auto flex flex-col overflow-x-auto w-full align-middle overflow-hidden border '>
				<KTable>
					<KTableHead
						tableHeaders={[
							{
								name: 'MOOCs',
								alignment: 'left',
								className: 'rounded-tl-md min-w-[20vw]',
							},
							{ name: 'Status', alignment: 'left' },
							{
								name: 'Creation Date',
								alignment: 'left',
							},
							{
								name: 'View Details',
								alignment: 'center',
								className: 'rounded-tr-md',
							},
						]}
					></KTableHead>
					<KTableBody>
						{!!bundles &&
							bundles.map(
								({ bundle_id: id, bundle_status, created_at }, idx) => (
									<tr
										key={id}
										className={
											idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
										}
									>
										<td className='px-4 py-2 whitespace-nowrap min-w-[25vw]'>
											{!!bundleDetails &&
												bundleDetails
													.filter(({ bundle_id }) => bundle_id === id)
													.map(({ name, url }, i) => (
														<div key={i}>
															<span className='text-black'>-&gt;</span>
															<NextLink
																href={url}
																target='_blank'
																className='text-blue-600 hover:underline underline-offset-2'
															>
																{name}
															</NextLink>
														</div>
													))}
										</td>

										<td className=' px-4 py-4 text-lg font-medium  '>
											{bundleStatus[bundle_status] ?? bundle_status}
										</td>

										<td className=' px-4 py-4 text-lg font-medium  '>
											{new Date(created_at).toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												timeZone: 'UTC',
											})}
										</td>

										<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<NextLink
												href={`/student/${course_id}/view-bundle/${id}`}
											>
												<button className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
													<ChevronDoubleRightIcon className='h-7 w-7 text-indigo-700 hover:text-indigo-500 cursor-pointer transition-colors' />
												</button>
											</NextLink>
										</td>
									</tr>
								)
							)}
						{bundles?.length === 0 && (
							<EmptyTableMessage cols={3} message='No bundles were found...' />
						)}
					</KTableBody>
				</KTable>

				<div className=' px-4 py-4 text-lg font-medium text-center '>
					<NextLink href={`/student/${course_id}/create-bundle`}>
						<button
							className={` py-1 px-3 text-white shadow-none text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
						>
							CREATE NEW BUNDLE
						</button>
					</NextLink>
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	const { id } = query;
	const token = req.cookies.token;
	const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/enrollments/${id}/bundles`;

	const { data } = await axios.get(backendURL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const { bundles: rawData } = data;

	// var ids=[];
	// for(var item of bundleDetails){
	//   vals.push(item.val);
	// }

	const bundle_ids = [...new Set(rawData.map(({ bundle_id }) => bundle_id))];

	const bundles = [];

	bundle_ids.map((elem) =>
		rawData
			.filter(({ bundle_id }) => bundle_id === elem)
			.slice(0, 1)
			.map(({ bundle_id, bundle_status, created_at }) => {
				bundles.push({
					bundle_id,
					bundle_status,
					created_at,
				});
			})
	);

	const bundleDetails = [];

	bundle_ids.map((elem) =>
		rawData
			.filter(({ bundle_id }) => bundle_id === elem)
			.map(({ bundle_id, name, url }) => {
				bundleDetails.push({
					bundle_id,
					name,
					url,
				});
			})
	);

	return {
		props: {
			course_id: id,
			bundles: bundles ?? [],
			bundleDetails: bundleDetails ?? [],
		},
	};
}
