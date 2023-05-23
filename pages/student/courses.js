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
	PauseIcon,
} from '@heroicons/react/24/solid';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import Tabs from '@components/Tabs';
import { notify } from 'utils/notify';
import { groupBy } from 'lodash';

export default function CourseSelectionPage({
	courses,
	enrollments,
	old_courses,
	dictEnrollments,
	dictAvailables,
	dictOldCourses,
}) {
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

	const tabs = [
		{ name: 'Enrolled Courses' },
		{ name: 'Available Courses' },
		{ name: 'Previous Courses' },
	];

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Courses</PageTitle>

			<Tabs {...{ selectedTabs, setSelectedTabs, tabs }} />

			{/* <div className='max-w-3xl mx-auto mb-8'>
				{JSON.stringify(old_courses, null, 2)}
			</div> */}

			{/* <div className='max-w-3xl mx-auto mb-8'>
				{JSON.stringify(courses, null, 2)}
			</div> */}

			{selectedTabs === 0 && (
				<div className='max-w-7xl w-full'>
					{Object.entries(dictEnrollments).map(([key, value], index) => (
						<div className='w-full ' key={index}>
							<div className='flex justify-between items-center w-full mb-2'>
								<h1 className='text-2xl font-semibold text-zinc-700'>
									{key}
									<span className='font-normal'> Semester Courses</span>
								</h1>
							</div>

							<div className='w-full overflow-x-auto mb-12 shadow-lg'>
								<KTable>
									<KTableHead
										tableHeaders={[
											{
												name: 'Course Code',
												alignment: 'left',
												className: 'rounded-tl-md',
											},
											{ name: 'Name', alignment: 'left' },
											{ name: 'Credits', alignment: 'center' },
											{
												name: 'View Bundles',
												alignment: 'center',
												className: 'rounded-tr-md',
											},
										]}
									></KTableHead>
									<KTableBody>
										{!!value &&
											value.map(
												(
													{ course_id, name, credits, course_code, is_waiting },
													idx
												) => (
													<tr
														key={course_id}
														className={
															idx % 2 === 0
																? 'bg-zinc-100'
																: 'bg-zinc-200/[0.75]'
														}
													>
														<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap'>
															{course_code}
														</td>
														<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap'>
															{name}
														</td>
														<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
															{credits}
														</td>
														<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
															{!is_waiting ? (
																<NextLink
																	href={`/student/${course_id}/bundles`}
																>
																	<button className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
																		<ChevronDoubleRightIcon className='h-7 w-7 text-indigo-700 hover:text-indigo-500 cursor-pointer transition-colors' />
																	</button>
																</NextLink>
															) : (
																<div className='py-2 px-2 text-rose-700 animate-pulse'>
																	Enrollment awaiting approval
																</div>
															)}
														</td>
													</tr>
												)
											)}
										{value?.length === 0 && (
											<EmptyTableMessage
												cols={4}
												message='No enrolled courses were found...'
											/>
										)}
									</KTableBody>
								</KTable>
							</div>
						</div>
					))}
				</div>
			)}

			{selectedTabs === 1 && (
				<div className='max-w-7xl w-full'>
					{Object.entries(dictAvailables).map(([key, value], index) => (
						<div className='w-full ' key={index}>
							<div className='flex justify-between items-center w-full mb-2'>
								<h1 className='text-2xl font-semibold text-zinc-700'>
									{key}
									<span className='font-normal'> Semester Courses</span>
								</h1>
							</div>

							<div className='w-full overflow-x-auto mb-12 shadow-lg'>
								<KTable>
									<KTableHead
										tableHeaders={[
											{
												name: 'Course Code',
												alignment: 'left',
												className: 'rounded-tl-md',
											},
											{ name: 'Name', alignment: 'left' },
											{ name: 'Credits', alignment: 'center' },
											{
												name: 'Enroll to Course',
												alignment: 'center',
												className: 'rounded-tr-md',
											},
										]}
									></KTableHead>
									<KTableBody>
										{!!value &&
											value.map(({ id, name, credits, course_code }, idx) => (
												<tr
													key={id}
													className={
														idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
													}
												>
													<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
														{course_code}
													</td>
													<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
														{name}
													</td>
													<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
														{credits}
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
										{value?.length === 0 && (
											<EmptyTableMessage
												cols={3}
												message='No courses were found...'
											/>
										)}
									</KTableBody>
								</KTable>
							</div>
						</div>
					))}
				</div>
			)}

			{selectedTabs === 2 && (
				<div className='max-w-7xl w-full'>
					{Object.entries(dictOldCourses).map(([key, value], index) => (
						<div className='w-full ' key={index}>
							<div className='flex justify-between items-center w-full mb-2'>
								<h1 className='text-2xl font-semibold text-zinc-700'>
									{key}
									<span className='font-normal'> Semester Courses</span>
								</h1>
							</div>

							<div className='w-full overflow-x-auto mb-12 shadow-lg'>
								<KTable>
									<KTableHead
										tableHeaders={[
											{
												name: 'Course Code',
												alignment: 'left',
												className: 'rounded-tl-md',
											},
											{ name: 'Name', alignment: 'left' },
											{ name: 'Credits', alignment: 'center' },
											{
												name: 'Status',
												alignment: 'center',
												className: 'rounded-tr-md',
											},
										]}
									></KTableHead>
									<KTableBody>
										{!!value &&
											value.map(
												({ id, name, credits, course_code, is_pass }, idx) => (
													<tr
														key={id}
														className={
															idx % 2 === 0
																? 'bg-zinc-100'
																: 'bg-zinc-200/[0.75]'
														}
													>
														<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
															{course_code}
														</td>
														<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
															{name}
														</td>
														<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
															{credits}
														</td>
														<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
															{!!is_pass ? (
																<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-emerald-500'>
																	<span className='drop-shadow-lg'>
																		PASSED COURSE
																	</span>
																</span>
															) : (
																<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-rose-500'>
																	<span className='drop-shadow-lg'>
																		FAILED COURSE
																	</span>
																</span>
															)}
														</td>
													</tr>
												)
											)}
										{value?.length === 0 && (
											<EmptyTableMessage
												cols={3}
												message='No courses were found...'
											/>
										)}
									</KTableBody>
								</KTable>
							</div>
						</div>
					))}
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

		const backendURLold = `${process.env.NEXT_PUBLIC_API_URL}/student/old-courses`;

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

		const { data: dataOld } = await axios.get(backendURLold, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { courses } = data;
		const { enrollments } = dataEnroll;
		const { old_courses } = dataOld;

		const dictAvailables = groupBy(courses, (course) => {
			return course.semester;
		});

		const dictEnrollments = groupBy(enrollments, (course) => {
			return course.semester;
		});

		const dictOldCourses = groupBy(old_courses, (course) => {
			return course.semester;
		});

		return {
			props: {
				courses,
				enrollments,
				old_courses,
				dictEnrollments,
				dictAvailables,
				dictOldCourses,
			},
		};
	} catch (error) {
		return {
			props: {
				courses: [],
				enrollments: [],
				old_courses: [],
				dictEnrollments: {},
				dictAvailables: {},
				dictOldCourses: {},
			},
		};
	}
}
