import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';

export default function AdminCoordinatorsPage({ coordinators }) {
	const Router = useRouter();

	// const handleEnroll = async (course_id) => {
	// 	try {
	// 		await axios.post('/api/student/enrolling', {
	// 			course_id,
	// 		});

	// 		Router.reload();
	// 	} catch (error) {
	// 		console.log(error);
	// 		alert(
	// 			error?.response?.data?.message?.message ??
	// 				error?.response?.data?.message ??
	// 				error?.message
	// 		);
	// 	}
	// };

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>Coordinators</h1>

			<div className='flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
				<table className='min-w-full border-solid border-0 border-b-2 border-collapse'>
					<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
						<tr>
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
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Department</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Delete</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!coordinators &&
							coordinators.map(
								({ id, name, surname, email, department_name }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{name} {surname}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{email}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{department_name}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => alert('durrr')}
												className='text-center text-lg py-1 px-3 bg-red-700 hover:bg-red-500 shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'
											>
												X
											</button>
										</td>
									</tr>
								)
							)}
						{coordinators?.length === 0 && (
							<EmptyTableMessage
								cols={3}
								message='No coordinators were found...'
							/>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/coordinators`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { coordinators } = data;

		return {
			props: {
				coordinators: coordinators ?? [],
			},
		};
	} catch (error) {
		return {
			props: {
				coordinators: [],
			},
		};
	}
}