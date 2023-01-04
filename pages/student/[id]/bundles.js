import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';

export default function CourseBundlesPage({
	course_id,
	bundles,
	bundleDetails,
}) {
	const Router = useRouter();

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>Your Bundles</h1>

			<div className='mr-2 self-end'>
				<NextLink href={`/student/${course_id}/create-bundle`}>
					<button className='mb-4 py-2 px-5 bg-[#212021] hover:bg-[#414041] shadow-md text-white text-lg font-thin rounded-full border-none cursor-pointer transition-colors'>
						CREATE NEW BUNDLE
					</button>
				</NextLink>
			</div>

			<div className='flex flex-col overflow-x-auto p-1.5 w-full align-middle overflow-hidden border'>
				<table className='min-w-full divide-y divide-gray-200 border-solid border-0 border-b-2 border-collapse'>
					<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
						<tr>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>ID</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>
									Creation Date
								</span>
							</th>
							<th
								scope='col'
								className={`min-w-[20vw]  px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>MOOCs</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Status</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Select</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!bundles &&
							bundles.map(({ bundle_id: id, bundle_status, created_at }) => (
								<tr
									key={id}
									className='border-solid border-0 border-b border-neutral-200'
								>
									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
										{10000 + id}
									</td>

									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
										{new Date(created_at).toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											timeZone: 'UTC',
										})}
									</td>

									<td className='px-4 py-2 whitespace-nowrap min-w-[25vw]'>
										{!!bundleDetails &&
											bundleDetails
												.filter(({ bundle_id }) => bundle_id === id)
												.map(({ name, url }, i) => (
													<div key={i}>
														<NextLink
															href={url}
															className='text-blue-600 hover:underline underline-offset-2'
														>
															<span className='text-black'>-&gt;</span>
															{name}
														</NextLink>
													</div>
												))}
									</td>

									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
										{bundle_status}
									</td>

									<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
										<NextLink href={`/student/${course_id}/view-bundle/${id}`}>
											<button className='text-center text-lg py-2 px-2 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
												GO
											</button>
										</NextLink>
									</td>
								</tr>
							))}
						{bundles?.length === 0 && (
							<EmptyTableMessage cols={3} message='No bundles were found...' />
						)}
					</tbody>
				</table>
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
