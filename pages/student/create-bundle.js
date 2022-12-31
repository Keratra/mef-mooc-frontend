import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CreateBundlePage({ moocs }) {
	const Router = useRouter();

	const [cart, setCart] = useState([]);

	const handleClick = () => {};

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-16 drop-shadow-md'>
				Creating a Bundle
			</h1>

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
											<span className='text-center'>Link</span>
										</th>
									</tr>
								</thead>

								{/* <tbody className='divide-y divide-gray-200'>
									{!!bundle &&
										bundle.map(
											({
												bundle_detail_id,
												certificate_url,
												mooc_id,
												mooc_name,
											}) => (
												<tr key={bundle_detail_id}>
													<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
														{mooc_id}
													</td>
													<td className='align-baseline px-4 py-4 text-lg font-medium'>
														{mooc_name}
													</td>

													<td className='align-baseline px-4 py-4 text-lg font-medium min-w-[15vw]'>
														<NextLink
															href={certificate_url}
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
								</tbody> */}
							</table>
						</div>
					</div>
				</div>
			</div>

			<div>
				<button
					onClick={handleClick}
					className='justify-self-end self-end place-self-end text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'
				>
					ADD MOOC
				</button>
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
