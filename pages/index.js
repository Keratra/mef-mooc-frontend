import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import NextLink from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<div className='h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-16 drop-shadow-md'>
				Who are you?
			</h1>

			<section className='mx-auto grid grid-cols-1 gap-4'>
				<NextLink
					href='/coordinator/auth/login'
					className='
						text-center text-xl text-white 
						py-2 px-4 font-bold
						bg-[#212021] hover:bg-[#414041] 
						shadow-md rounded-xl border-none
						ring-2 ring-offset-0 ring-[#212021]
						hover:ring-4 hover:ring-offset-4 hover:ring-purple-900
						cursor-pointer transition-all
					'
				>
					Coordinator
				</NextLink>

				<NextLink
					href='/student/auth/login'
					className='
						text-center text-xl text-white 
						py-2 px-4 font-bold
						bg-[#212021] hover:bg-[#414041] 
						shadow-md rounded-xl border-none
						ring-2 ring-offset-0 ring-[#212021]
						hover:ring-4 hover:ring-offset-4 hover:ring-purple-900
						cursor-pointer transition-all
					'
				>
					Student
				</NextLink>

				<NextLink
					href='/admin/auth/login'
					className='
						text-center text-xl text-white 
						py-2 px-4 font-bold
						bg-[#212021] hover:bg-[#414041] 
						shadow-md rounded-xl border-none
						ring-2 ring-offset-0 ring-[#212021]
						hover:ring-4 hover:ring-offset-4 hover:ring-purple-900
						cursor-pointer transition-all
					'
				>
					Administrator
				</NextLink>
			</section>

			{/* <div className='flex flex-col'>
				<h1 className='text-2xl font-bold text-center mb-4'>Avaible Courses</h1>
				<div className='overflow-x-auto'>
					<div className='p-1.5 w-full inline-block align-middle'>
						<div className='overflow-hidden border rounded-lg'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Name
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Semester
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Status
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Select
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											GE 201
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2022
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											WAITING
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<a
												className='text-green-500 hover:text-green-700'
												href='#'
											>
												<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
													GO
												</button>
											</a>
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'></td>
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											GE 202
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2022
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											WAITING
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<a
												className='text-green-500 hover:text-green-700'
												href='#'
											>
												<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
													GO
												</button>
											</a>
										</td>
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											GE 203
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2022
										</td>
										<td className='px-6 py-4 text-sm font-bold text-green-800 whitespace-nowrap'>
											ACCEPTED
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<a
												className='text-green-500 hover:text-green-700'
												href='#'
											>
												<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
													{' '}
													GO
												</button>
											</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-col'>
				<h1 className='text-2xl font-bold text-center mb-4'>
					Your Bundles of GE201
				</h1>
				<div className='overflow-x-auto'>
					<div className='p-1.5 w-full inline-block align-middle'>
						<div className='overflow-hidden border rounded-lg'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Name
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Semester
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Status
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Select
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											GE 201
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2022
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											WAITING
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<a
												className='text-green-500 hover:text-green-700'
												href='#'
											>
												<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
													GO
												</button>
											</a>
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'></td>
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											GE 202
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2022
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											WAITING
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<a
												className='text-green-500 hover:text-green-700'
												href='#'
											>
												<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
													GO
												</button>
											</a>
										</td>
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											GE 203
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2022
										</td>
										<td className='px-6 py-4 text-sm font-bold text-green-800 whitespace-nowrap'>
											ACCEPTED
										</td>
										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<a
												className='text-green-500 hover:text-green-700'
												href='#'
											>
												<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
													{' '}
													GO
												</button>
											</a>
										</td>

										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<a
												className='text-green-500 hover:text-green-700'
												href='#'
											>
												<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
													Create New Bundle
												</button>
											</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-col'>
				<h1 className='text-2xl font-bold text-center mb-4'>
					Creating a Bundle
				</h1>
				<div className='overflow-x-auto'>
					<div className='p-1.5 w-full inline-block align-middle'>
						<div className='overflow-hidden border rounded-lg'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											MOOC
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Credits
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Hours
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Col4
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											Python Int.
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											50
										</td>

										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'></td>
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											Data Science
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											1
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											29
										</td>
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											Test1
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											1.2
										</td>
										<td className='px-6 py-4 text-sm font-bold text-green-800 whitespace-nowrap'>
											36
										</td>

										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
											<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
												ADD MOOC
											</button>
										</td>
									</tr>
								</tbody>
								<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
									<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
										Create Bundle
									</button>
								</td>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-col'>
				<h1 className='text-2xl font-bold text-center mb-4'>
					Selected GE201 Bundle
				</h1>
				<div className='overflow-x-auto'>
					<div className='p-1.5 w-full inline-block align-middle'>
						<div className='overflow-hidden border rounded-lg'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											MOOC
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Credits
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Hours
										</th>
										<th
											scope='col'
											className={`md:col-span-2 font-bold text-center text-1xl  drop-shadow-md`}
										>
											Certificate Link
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											Python Int.
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											2
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											50
										</td>
										<input type='text' id='first' name='first' />
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											Data Science
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											1
										</td>
										<td className='px-6 py-4 text-sm font-bold text-yellow-800 whitespace-nowrap'>
											29
										</td>
										<input type='text' id='first' name='first' />
									</tr>
									<tr>
										<td className='px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap'>
											Test1
										</td>
										<td className='px-6 py-4 text-sm text-gray-800 whitespace-nowrap'>
											1.2
										</td>
										<td className='px-6 py-4 text-sm font-bold text-green-800 whitespace-nowrap'>
											36
										</td>
										<input type='text' id='first' name='first' />

										<td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'></td>
									</tr>
								</tbody>
								<button className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'>
									Submit Bundle
								</button>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-col justify-center items-center'>
				<h1 className='text-center text-5xl mb-16 drop-shadow-md'>
					Available Courses
				</h1>
				<table className='table-auto'>
					<thead>
						<tr>
							<th className='px-4 py-2'>Name</th>
							<th className='px-4 py-2'>Semester</th>
							<th className='px-4 py-2'>Status</th>
							<th className='px-4 py-2'>Select</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className='border px-4 py-2'>Introduction </td>
							<td className='border px-4 py-2'>COMP 100</td>
							<td className='border px-4 py-2'>cem</td>
						</tr>
						<tr className='bg-gray-100'>
							<td className='border px-4 py-2'>Introduction </td>
							<td className='border px-4 py-2'>COMP 100</td>
							<td className='border px-4 py-2'>cem</td>
						</tr>
						<tr>
							<td className='border px-4 py-2'>Introduction </td>
							<td className='border px-4 py-2'>COMP 100</td>
							<td className='border px-4 py-2'>cem</td>
						</tr>
					</tbody>
				</table>
			</div> */}
		</div>
	);
}
