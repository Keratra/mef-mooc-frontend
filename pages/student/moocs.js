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
			<h1 className='text-center text-5xl my-16 drop-shadow-md'>MOOC List</h1>

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
											<span className='text-center'>MOOC ID</span>
										</th>
										<th
											scope='col'
											className={`min-w-[20vw] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>MOOC Name</span>
										</th>
										<th
											scope='col'
											className={`min-w-[170px] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>Platform</span>
										</th>
										<th
											scope='col'
											className={`min-w-[170px] px-4 py-2 bg-slate-200 font-bold text-center text-2xl drop-shadow-sm`}
										>
											<span className='text-center'>Link</span>
										</th>
									</tr>
								</thead>

								<tbody className='divide-y divide-gray-200'>
									{!!moocs &&
										moocs.map(({ id, url, platform, name }) => (
											<tr key={id}>
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
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps({ req }) {
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
}
