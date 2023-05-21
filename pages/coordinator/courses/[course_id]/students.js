import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { useRouter } from 'next/router';
import { groupBy } from 'lodash';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import Tabs from '@components/Tabs';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { notify } from 'utils/notify';

export default function CoordinatorCoursePage({
	students,
	waiting_students,
	is_active,
	course,
}) {
	const Router = useRouter();
	const [selectedTabs, setSelectedTabs] = useState(0); // tabs

	const { course_id } = Router.query;

	const handleApprove = async (student_id) => {
		try {
			if (!confirm('Are you sure about approving this enrollment?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/approve-enrollment`, {
				course_id,
				student_id,
			});

			notify('success', 'Enrollment approved successfully');
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

	const handleReject = async (student_id) => {
		try {
			if (!confirm('Are you sure about rejecting this enrollment?'))
				throw new Error('Action refused by user');

			const message = prompt(
				'Please enter a message to the student about rejection reason'
			);

			if (!message) throw new Error('Message is required');

			if (message.length > 2000)
				throw new Error('Message is too long, max 2000 chars');

			await axios.post(`/api/coordinator/reject-enrollment`, {
				course_id,
				message,
				student_id,
			});

			notify('success', 'Enrollment rejected successfully');
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

	const classLabel = `
		md:col-span-2
		mt-3 p-2 -mb-4 rounded-lg
		text-xl font-semibold
	`;

	const classInput = `
		md:col-span-2
		p-2 rounded-lg
		border-solid border-2 border-neutral-400
		text-base bg-neutral-50
	`;

	const classError = `
		md:col-span-2
		ml-2 rounded-lg
		text-base text-red-600
		drop-shadow-md
	`;

	const tabs = [
		{ name: 'Students Awaiting Enrollment Approval' },
		{ name: 'All Students' },
	];

	return (
		<div className='flex flex-col justify-center items-center'>
			<span className='text-center text-2xl font-bold mt-4'>
				{course.course_code} {course.name}
			</span>

			<span className='text-center text-xl font-semibold mt-2'>
				{course.semester} ({course.credits} credits)
			</span>

			{!is_active && (
				<div className='min-w-[95%] my-4 mx-4 p-3 bg-gradient-to-t from-rose-100 to-rose-50 rounded-lg shadow-md text-3xl text-rose-600 text-center font-bold'>
					This is an inactive course!
				</div>
			)}

			<section className='w-[95%] px-2 py-4 sm:px-0 font-sans transition-all '>
				<div className='flex space-x-1 rounded-xl bg-zinc-200/[0.8]  p-1'>
					<NextLink
						href={`/coordinator/courses/${course_id}/reports`}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								false
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<div>
							<span className='drop-shadow-md select-none '>Reports</span>
						</div>
					</NextLink>
					<NextLink
						href={`/coordinator/courses/${course_id}`}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								false
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<div>
							<span className='drop-shadow-md select-none '>
								Action Required Bundles
							</span>
						</div>
					</NextLink>
					<NextLink
						href={`/coordinator/courses/${course_id}/students`}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								true
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<div>
							<span className='drop-shadow-md select-none '>Students</span>
						</div>
					</NextLink>
				</div>
			</section>

			<Tabs {...{ selectedTabs, setSelectedTabs, tabs, fullWidth: false }} />

			{selectedTabs === 0 && (
				<div className='flex flex-col overflow-x-auto w-[95%] align-middle overflow-hidden border shadow-lg'>
					<KTable>
						<KTableHead
							tableHeaders={[
								{
									name: 'Student No',
									alignment: 'left',
									className: 'rounded-tl-md',
								},
								{ name: 'Name', alignment: 'left' },
								{ name: 'Email', alignment: 'left' },
								{
									name: 'Previous Courses',
									alignment: 'center',
								},
								{
									name: 'Actions',
									alignment: 'center',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{!!waiting_students &&
								Object.entries(waiting_students).map(([key, value], idx) => (
									<tr
										key={key}
										className={
											idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
										}
									>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{value[0]?.student_no}
										</td>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{value[0]?.name} {value[0]?.surname}
										</td>
										<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{value[0]?.email}
										</td>
										<td className='px-4 py-4 text-lg font-medium '>
											{(value?.length === 0 ||
												(value?.length === 1 && !value[0]?.course_id)) && (
												<div className='mr-1 font-bold text-center rounded-xl text-rose-500'>
													<span className='drop-shadow-lg'>
														There are no previous courses
													</span>
												</div>
											)}
											{console.log(value)}
											{value?.map(
												(
													{
														pass_date,
														course_code,
														course_name,
														course_id,
														credits,
														semester,
														is_course_active,
														is_passed_course,
														is_waiting_enrollment,
													},
													index
												) => (
													<div key={index}>
														{course_id && (
															<div className='grid grid-cols-3 gap-y-4'>
																<div className='w-full'>
																	{!is_course_active ? (
																		is_passed_course ? (
																			<div className='mr-1 font-bold text-center rounded-xl text-white bg-green-500'>
																				<span className='drop-shadow-lg'>
																					PASSED COURSE
																				</span>
																			</div>
																		) : (
																			<div className='mr-1 font-bold text-center rounded-xl text-white bg-rose-500'>
																				<span className='drop-shadow-lg'>
																					FAILED COURSE
																				</span>
																			</div>
																		)
																	) : is_passed_course ? (
																		<div className='mr-1 font-bold text-center rounded-xl text-white bg-green-500'>
																			<span className='drop-shadow-lg'>
																				PASSED COURSE
																			</span>
																		</div>
																	) : is_waiting_enrollment ? (
																		<div className='mr-1 font-bold text-center rounded-xl text-white bg-yellow-500'>
																			<span className='drop-shadow-lg'>
																				IN WAITING LIST
																			</span>
																		</div>
																	) : (
																		<div className='mr-1 font-bold text-center rounded-xl text-white bg-sky-500'>
																			<span className='drop-shadow-lg'>
																				CURRENTLY ENROLLED
																			</span>
																		</div>
																	)}
																</div>
																<div className='mb-1 col-span-2'>
																	{course_code} {course_name}
																	{', '}
																	{semester} ({credits} credits)
																	{!!pass_date && (
																		<div>Pass Date: {pass_date}</div>
																	)}
																</div>
															</div>
														)}
													</div>
												)
											)}
										</td>
										<td className='px-4 py-4 text-lg font-medium text-center'>
											<div className='my-4 flex flex-col gap-4 justify-evenly items-center'>
												<button
													onClick={() => handleReject(key)}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-rose-500 bg-rose-700 text-rose-50 transition-colors'
												>
													<span className='drop-shadow-md select-none'>
														Reject
													</span>
												</button>
												<button
													onClick={() => handleApprove(key)}
													className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-emerald-500 bg-emerald-700 text-emerald-50 transition-colors'
												>
													<span className='drop-shadow-md select-none'>
														Approve
													</span>
												</button>
											</div>
										</td>
									</tr>
								))}
							{Object.keys(waiting_students)?.length === 0 && (
								<EmptyTableMessage
									cols={4}
									message='No waiting students were found...'
								/>
							)}
						</KTableBody>
					</KTable>
				</div>
			)}

			{selectedTabs === 1 && (
				<div className='flex flex-col overflow-x-auto w-[95%] align-middle overflow-hidden border shadow-lg'>
					<KTable>
						<KTableHead
							tableHeaders={[
								{
									name: 'Student No',
									col: 'student_no',
									className: 'rounded-tl-md',
								},
								{ name: 'Name', col: 'name' },
								{ name: 'Email', col: 'email', className: 'rounded-tr-md' },
							]}
						></KTableHead>
						<KTableBody>
							{!!students &&
								students.map(
									({ id, name, surname, email, student_no }, idx) => (
										<tr
											key={id}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												{student_no}
											</td>
											<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												{name} {surname}
											</td>
											<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												{email}
											</td>
										</tr>
									)
								)}
							{students?.length === 0 && (
								<EmptyTableMessage
									cols={6}
									message='No students were found...'
								/>
							)}
						</KTableBody>
					</KTable>
				</div>
			)}
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const token = req.cookies.token;
		const { course_id } = query;
		const backendURLst = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/students`;
		const backendURLen = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-students`;
		const backendURLrc = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/rejected-certificates`;

		const { data: dataST } = await axios.get(backendURLst, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataEN } = await axios.get(backendURLen, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataRC } = await axios.get(backendURLrc, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const backendURLco = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/info`;

		const { data: dataCo } = await axios.get(backendURLco, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { course } = dataCo;

		const { is_active } = dataRC;

		const { students } = dataST;
		const { students: waiting_students_raw } = dataEN;

		const waiting_students = groupBy(waiting_students_raw, (student) => {
			return student.student_id;
		});

		return {
			props: {
				students,
				waiting_students,
				is_active,
				course,
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				students: [],
				waiting_students: [],
				is_active: false,
				course: {},
			},
		};
	}
}
