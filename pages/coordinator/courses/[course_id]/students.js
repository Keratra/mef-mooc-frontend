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

export default function CoordinatorCoursePage({
	students,
	waiting_students,
	is_active,
}) {
	const Router = useRouter();
	const [selectedTabs, setSelectedTabs] = useState(0); // tabs

	const { course_id } = Router.query;

	const handleApproveBundle = async (bundle_id) => {
		// alert(JSON.stringify({ course_id, bundle_id }, null, 2));

		try {
			if (bundle_id === 0) throw 'Please select a bundle';
			if (!confirm('Are you sure about approving this bundle?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/approve-bundle`, {
				course_id,
				bundle_id,
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

	const handleRejectBundle = async (bundle_id) => {
		// alert(JSON.stringify({ course_id, bundle_id }, null, 2));

		try {
			if (bundle_id === 0) throw 'Please select a bundle';
			if (!confirm('Are you sure about approving this bundle?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/reject-bundle`, {
				course_id,
				bundle_id,
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

	const tabs = [{ name: 'Awaiting Enrollments' }, { name: 'Students' }];

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>
				<NextLink href={`/coordinator/courses/${course_id}`}>
					<FiChevronLeft size={34} className='  align-text-bottom' />
				</NextLink>
				Students
				<FiChevronRight
					size={34}
					className=' text-zinc-300 align-text-bottom'
				/>
			</PageTitle>

			<Tabs {...{ selectedTabs, setSelectedTabs, tabs }} />

			{!is_active && (
				<div className='min-w-[95%] mt-4 mx-4 p-3 bg-gradient-to-t from-rose-100 to-rose-50 rounded-lg shadow-md text-3xl text-rose-600 text-center font-bold'>
					This is an inactive course!
				</div>
			)}

			{selectedTabs === 0 && (
				<div className='max-w-7xl mx-auto  flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
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
									alignment: 'left',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{!!waiting_students &&
								waiting_students.map(
									({
										id,
										name,
										surname,
										email,
										student_no,
										pass_date,
										course_code,
										course_name,
										credits,
										semester,
									}) => (
										<tr
											key={id}
											className='border-solid border-0 border-b border-neutral-200'
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
											<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												{pass_date} {course_code} {course_name} {credits}{' '}
												{semester}
											</td>
										</tr>
									)
								)}
							{waiting_students?.length === 0 && (
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
				<div className='max-w-7xl mx-auto  flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
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
								students.map(({ id, name, surname, email, student_no }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200'
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
								))}
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
		const backendURLrc = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/rejected-certificates`;
		const backendURLen = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-students`;

		const { data: dataST } = await axios.get(backendURLst, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataRC } = await axios.get(backendURLrc, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataEN } = await axios.get(backendURLen, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { is_active } = dataRC;

		const { students } = dataST;
		const { students: waiting_students } = dataEN;

		return {
			props: {
				students,
				waiting_students,
				is_active,
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				students: [],
				waiting_students: [],
				is_active: false,
			},
		};
	}
}
