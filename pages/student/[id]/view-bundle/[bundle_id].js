import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';

export default function BundleViewPage({ course_id, bundle_id, bundle }) {
	const Router = useRouter();

	const handleLinkUpdate = async (bundle_detail_id) => {
		try {
			const certificate_url = prompt('Enter the link to the certificate here');

			await axios.post('/api/student/certificate-update', {
				course_id,
				bundle_id,
				bundle_detail_id,
				certificate_url,
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

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>
				Selected Bundle
			</h1>

			<div className='flex flex-col overflow-x-auto p-1.5 w-full align-middle overflow-hidden border'>
				<table className='min-w-full border-solid border-0 border-b-2 border-collapse :'>
					<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
						<tr>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>MOOC ID</span>
							</th>
							<th
								scope='col'
								className={`min-w-[20vw]  px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>MOOC Name</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>
									Certificate Link
								</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Update Link</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!bundle &&
							bundle.map(
								({ bundle_detail_id, certificate_url, mooc_id, mooc_name }) => (
									<tr
										key={bundle_detail_id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{mooc_id}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium'>
											{mooc_name}
										</td>

										<td className='align-baseline px-4 py-4 text-lg font-medium min-w-[15vw]'>
											<NextLink
												href={certificate_url ?? ''}
												className='text-blue-600 hover:underline underline-offset-2'
											>
												{certificate_url}
											</NextLink>
										</td>

										<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => handleLinkUpdate(bundle_detail_id)}
												className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'
											>
												Update
											</button>
										</td>
									</tr>
								)
							)}
						{bundle?.length === 0 && (
							<EmptyTableMessage
								cols={4}
								message='No bundle details were found...'
							/>
						)}
					</tbody>
				</table>
			</div>
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
