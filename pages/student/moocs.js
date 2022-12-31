import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function MOOCListPage({ moocs }) {
	const Router = useRouter();

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mt-16 mb-4 drop-shadow-md'>
				MOOC List
			</h1>

			<div className='flex flex-col overflow-x-auto p-1.5 w-full align-middle overflow-hidden border'>
				<table className='min-w-full border-solid border-0 border-b-2 border-collapse'>
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
								<span className='text-center drop-shadow-md'>Platform</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Link</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!moocs &&
							moocs.map(({ id, url, platform, name }) => (
								<tr
									key={id}
									className='border-solid border-0 border-b border-neutral-200'
								>
									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
										{id}
									</td>
									<td className='align-baseline px-4 py-4 text-lg font-medium'>
										{name}
									</td>

									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
										{platform}
									</td>

									<td className='align-baseline px-4 py-4 text-lg font-medium min-w-[15vw]'>
										<NextLink
											href={url}
											className='text-blue-600 hover:underline underline-offset-2'
										>
											{url}
										</NextLink>
									</td>
								</tr>
							))}
						{moocs?.length !== 0 && (
							<tr>
								<td
									colSpan={4}
									className='w-full px-2 font-semibold text-xl text-red-600'
								>
									No MOOCs were found...
								</td>
							</tr>
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
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/moocs`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { moocs } = data;

		return {
			props: {
				moocs,
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				moocs: [],
			},
		};
	}
}
