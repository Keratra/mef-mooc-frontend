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
import { notify } from 'utils/notify';

export default function CourseSelectionPage({ courses, enrollments }) {
	const Router = useRouter();
	const [selectedTabs, setSelectedTabs] = useState(0); // tabs

	const handleEnroll = async (course_id) => {
		try {
			await axios.post('/api/student/enrolling', {
				course_id,
			});

			Router.reload();
		} catch (error) {
			console.log(error);
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const tabs = [{ name: 'Enrolled Courses' }, { name: 'Available Courses' }];

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Courses</PageTitle>

			<Tabs {...{ selectedTabs, setSelectedTabs, tabs }} />

			{selectedTabs === 0 && (
				<div className='max-w-7xl mx-auto  flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
					<KTable>
						<KTableHead
							tableHeaders={[
								{
									name: 'Course Code',
									alignment: 'left',
									className: 'rounded-tl-md',
								},
								{ name: 'Name', alignment: 'left' },
								{
									name: 'View Bundles',
									alignment: 'center',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{!!enrollments &&
								enrollments.map(({ course_id, name, course_code }) => (
									<tr
										key={course_id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{course_code}
										</td>
										<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{name}
										</td>
										<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<NextLink href={`/student/${course_id}/bundles`}>
												<button className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
													<ChevronDoubleRightIcon className='h-7 w-7 text-indigo-700 hover:text-indigo-500 cursor-pointer transition-colors' />
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
						</KTableBody>
					</KTable>
				</div>
			)}

			{selectedTabs === 1 && (
				<div className='max-w-7xl mx-auto  flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
					<KTable>
						<KTableHead
							tableHeaders={[
								{
									name: 'Course Code',
									alignment: 'left',
									className: 'rounded-tl-md',
								},
								{ name: 'Name', alignment: 'left' },
								{
									name: 'Enroll to Course',
									alignment: 'center',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{!!courses &&
								courses.map(({ id, name, course_code }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{course_code}
										</td>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{name}
										</td>
										<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
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
								<EmptyTableMessage
									cols={3}
									message='No courses were found...'
								/>
							)}
						</KTableBody>
					</KTable>
				</div>
			)}
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
