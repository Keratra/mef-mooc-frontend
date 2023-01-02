import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';

export default function CourseSelectionPage({ courses, enrollments }) {
	const Router = useRouter();

	const handleEnroll = async (course_id) => {
		try {
			await axios.post('/api/student/enrolling', {
				course_id,
			});

			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		}
	};

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>Enrollments</h1>

			<div className='flex flex-col mb-24 overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
				<table className='min-w-full border-solid border-0 border-b-2 border-collapse'>
					<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
						<tr>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Course Code</span>
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
								<span className='text-center drop-shadow-md'>Select</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!enrollments &&
							enrollments.map(({ enrolment_id, name, course_code }) => (
								<tr
									key={enrolment_id}
									className='border-solid border-0 border-b border-neutral-200'
								>
									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
										{course_code}
									</td>
									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
										{name}
									</td>
									<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
										<NextLink href={`/student/${enrolment_id}/bundles`}>
											<button className='text-center text-lg py-2 px-2 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
												GO
											</button>
										</NextLink>
									</td>
								</tr>
							))}
						{enrollments?.length === 0 && (
							<EmptyTableMessage
								cols={3}
								message='No enrolled courses were found...'
							/>
						)}
					</tbody>
				</table>
			</div>

			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>
				Available Courses
			</h1>

			<div className='flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
				<table className='min-w-full border-solid border-0 border-b-2 border-collapse'>
					<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
						<tr>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Course Code</span>
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
								<span className='text-center drop-shadow-md'>Select</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!courses &&
							courses.map(({ id, name, course_code }) => (
								<tr
									key={id}
									className='border-solid border-0 border-b border-neutral-200'
								>
									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
										{course_code}
									</td>
									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
										{name}
									</td>
									<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
										<button
											onClick={() => handleEnroll(id)}
											className='text-center text-lg py-1 px-3 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'
										>
											Enroll
										</button>
									</td>
								</tr>
							))}
						{courses?.length === 0 && (
							<EmptyTableMessage cols={3} message='No courses were found...' />
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
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/courses`;
		const backendURLEnroll = `${process.env.NEXT_PUBLIC_API_URL}/student/enrollments`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataEnroll } = await axios.get(backendURLEnroll, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { courses } = data;
		const { enrollments } = dataEnroll;

		return {
			props: {
				courses: courses ?? [],
				enrollments: enrollments ?? [],
			},
		};
	} catch (error) {
		return {
			props: {
				courses: [],
				enrollments: [],
			},
		};
	}
}
