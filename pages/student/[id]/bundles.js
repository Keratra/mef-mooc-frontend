import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CourseBundlesPage({
	course_id,
	bundles,
	bundleDetails,
}) {
	const Router = useRouter();

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-16 drop-shadow-md'>
				Your Bundles
			</h1>

			<div>
				<NextLink href='/student/create-bundle'>
					<button className='justify-self-end self-end place-self-end text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
						CREATE NEW BUNDLE
					</button>
				</NextLink>
			</div>

			<div className='flex flex-col'>
				<div className='overflow-x-auto'>
					<div className='p-1.5 w-full inline-block align-middle'>
						<div className='overflow-hidden border'>
							<table className='min-w-full divide-y divide-gray-200 border-solid border-0 border-b-2'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className={`min-w-[170px] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>ID</span>
										</th>
										<th
											scope='col'
											className={`min-w-[170px] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>Creation Date</span>
										</th>
										<th
											scope='col'
											className={`min-w-[20vw] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>MOOCs</span>
										</th>
										<th
											scope='col'
											className={`min-w-[170px] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>Status</span>
										</th>
										<th
											scope='col'
											className={`min-w-[170px] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>Select</span>
										</th>
									</tr>
								</thead>

								<tbody className='divide-y divide-gray-200'>
									{!!bundles &&
										bundles.map(
											({ bundle_id: id, bundle_status, created_at }) => (
												<tr key={id}>
													<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
														{id}
													</td>

													<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
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

													<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
														{bundle_status}
													</td>

													<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
														<NextLink
															href={`/student/${course_id}/view-bundle/${id}`}
														>
															<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
																GO
															</button>
														</NextLink>
													</td>
												</tr>
											)
										)}
								</tbody>
							</table>
						</div>
					</div>
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
