import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addCourseModel } from 'lib/yupmodels';
import axios from 'axios';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { useRouter } from 'next/router';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import {
	UsersIcon,
	UserMinusIcon,
	PencilSquareIcon,
	TrashIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';

export default function CoordinatorCoursesPage({
	active_courses,
	inactive_courses,
	semesters,
}) {
	const Router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const [selectedTabs, setSelectedTabs] = useState(0); // tabs

	const handleAdd = async (
		{ course_code, name, type, semester, credits },
		{ setSubmitting }
	) => {
		// alert(JSON.stringify({ course_code, name, type, semester, credits }, null, 4));

		try {
			if (semester === 0) throw new Error('Select a valid semester');

			await axios.post(`/api/coordinator/add-course`, {
				course_code,
				name,
				type: 'blank',
				semester,
				credits,
			});

			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeactivate = async (course_id) => {
		// alert(JSON.stringify({ course_id }, null, 2));

		try {
			if (course_id === 0) throw 'Please select a course';
			if (!confirm('Are you sure about deactivating the course?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/deactivate-course`, {
				course_id,
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

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

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

	const tableHeaders = [
		{ name: 'Course Code', alignment: 'left', className: 'rounded-tl-md' },
		{ name: 'Name', alignment: 'left' },
		{ name: 'Credits', alignment: 'left' },
		{ name: 'Semester', alignment: 'left' },
		{ name: 'Deactivate', alignment: 'center' },
		{ name: 'View', alignment: 'center', className: 'rounded-tr-md' },
	];

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Courses</PageTitle>

			<section className='w-full max-w-6xl px-2 pb-8 sm:px-0 font-sans transition-all '>
				<div className='flex space-x-1 rounded-xl bg-zinc-200/[0.8]  p-1'>
					<div
						onClick={() => setSelectedTabs(0)}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								selectedTabs === 0
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<span className='drop-shadow-md select-none '>Active Courses</span>
					</div>
					<div
						onClick={() => setSelectedTabs(1)}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								selectedTabs === 1
									? 'bg-white text-rose-900 shadow'
									: 'text-rose-900/[0.5] bg-white/[0.35] hover:bg-white hover:text-rose-900'
							}
						`}
					>
						<span className='drop-shadow-md select-none '>
							Deactivated Courses
						</span>
					</div>
				</div>
			</section>

			{selectedTabs === 0 && (
				<div className='w-full max-w-6xl mx-auto'>
					<KTable>
						<KTableHead {...{ tableHeaders }}></KTableHead>
						<KTableBody>
							{!!active_courses &&
								active_courses.map(
									(
										{ id, course_code, name, semester, credits, is_active },
										idx
									) => (
										<tr
											key={id}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{course_code}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{name}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{credits}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{semester}
											</td>
											<td className='  px-4 py-4 text-lg font-medium text-center whitespace-nowrap '>
												<button
													onClick={() => handleDeactivate(id)}
													className={`inline-flex justify-center items-center  py-1 px-3 shadow-none text-white text-center text-lg font-thin rounded-full bg-transparent border-none`}
												>
													<TrashIcon className='h-7 w-7 text-rose-700 hover:text-rose-500 cursor-pointer transition-colors' />
												</button>
											</td>
											<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap '>
												<NextLink href={`/coordinator/courses/${id}`}>
													<button className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
														<ChevronDoubleRightIcon className='h-7 w-7 text-indigo-700 hover:text-indigo-500 cursor-pointer transition-colors' />
													</button>
												</NextLink>
											</td>
										</tr>
									)
								)}
							{active_courses?.length === 0 && (
								<EmptyTableMessage
									cols={6}
									message='No active courses were found...'
								/>
							)}
						</KTableBody>
					</KTable>

					<div className=' px-4 py-4 text-lg font-medium text-center '>
						<button
							onClick={() => openModal()}
							className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
						>
							CREATE COURSE
						</button>
					</div>
				</div>
			)}

			{selectedTabs === 1 && (
				<div className='w-full max-w-6xl mx-auto'>
					<table className='w-full border-spacing-0 rounded-lg border-solid border-2 border-zinc-300 shadow-lg  '>
						<thead className='bg-gradient-to-t from-zinc-300 to-zinc-200 text-black'>
							<tr>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tl-md `}
								>
									<span className='text-center drop-shadow-md'>
										Course Code
									</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Name</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Credits</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Semester</span>
								</th>
								<th
									scope='col'
									align='center'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tr-md`}
								>
									<span className='text-center drop-shadow-md'>View</span>
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200'>
							{!!inactive_courses &&
								inactive_courses.map(
									(
										{ id, course_code, name, semester, credits, is_active },
										idx
									) => (
										<tr
											key={id}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{course_code}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{name}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{credits}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap '>
												{semester}
											</td>
											<td className=' px-4 py-4 text-lg font-medium text-center whitespace-nowrap '>
												<NextLink href={`/coordinator/courses/${id}`}>
													<button className=' inline-flex justify-center items-center text-center text-lg py-2 px-2 bg-transparent shadow-none text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
														<ChevronDoubleRightIcon className='h-7 w-7 text-indigo-700 hover:text-indigo-500 cursor-pointer transition-colors' />
													</button>
												</NextLink>
											</td>
										</tr>
									)
								)}
							{inactive_courses?.length === 0 && (
								<EmptyTableMessage
									cols={5}
									message='No inactive courses were found...'
								/>
							)}
						</tbody>
					</table>
				</div>
			)}

			<Modal
				{...{ isOpen, setIsOpen, closeModal, openModal }}
				title='Add a new course'
			>
				<div className=' transition-all mt-2 '>
					<Formik
						initialValues={addCourseModel.initials}
						validationSchema={addCourseModel.schema}
						onSubmit={handleAdd}
					>
						{({
							setFieldValue,
							values,
							errors,
							touched,
							handleChange,
							handleSubmit,
							isSubmitting,
						}) => (
							<form
								onSubmit={handleSubmit}
								className={`grid grid-cols-1 md:grid-cols-2 gap-2 content-center place-content-center px-4`}
							>
								<label className={classLabel} htmlFor='course_code'>
									Course Code
								</label>
								<input
									className={classInput}
									type='text'
									name='course_code'
									id='course_code'
									value={values.course_code}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.course_code &&
										touched.course_code &&
										errors.course_code}
								</span>

								<label className={classLabel} htmlFor='name'>
									Name
								</label>
								<input
									className={classInput}
									type='text'
									name='name'
									id='name'
									value={values.name}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.name && touched.name && errors.name}
								</span>

								<label className={classLabel} htmlFor='semester'>
									Semester
								</label>
								<select
									name='semester'
									id='semester'
									className={classInput}
									value={values.semester}
									onChange={(e) => {
										setFieldValue('semester', e.target.value);
									}}
								>
									<option value={0}>None</option>
									{!!semesters &&
										semesters.map((semester, i) => (
											<option key={i} value={semester}>
												{semester}
											</option>
										))}
								</select>
								<span className={classError}>
									{errors.semester && touched.semester && errors.semester}
								</span>

								<label className={classLabel} htmlFor='credits'>
									Credits
								</label>
								<input
									className={classInput}
									type='text'
									name='credits'
									id='credits'
									value={values.credits}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.credits && touched.credits && errors.credits}
								</span>

								<button
									variant='contained'
									color='primary'
									size='large'
									type='submit'
									className={`mx-auto  my-4 md:col-span-2 tracking-wider text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
									disabled={isSubmitting}
								>
									<div
										className={`inline-block rounded-sm bg-purple-500 ${
											isSubmitting && 'w-4 h-4 mr-2 animate-spin'
										}`}
									></div>
									<span>{isSubmitting ? 'Adding...' : 'Add Course'}</span>
								</button>
							</form>
						)}
					</Formik>
				</div>
			</Modal>
		</div>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;
		const backendURLActive = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/active-courses`;
		const backendURLInactive = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/inactive-courses`;
		const backendURLSemesters = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/possible-semesters`;

		const { data: dataActive } = await axios.get(backendURLActive, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataInactive } = await axios.get(backendURLInactive, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataSemesters } = await axios.get(backendURLSemesters, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { courses: active_courses } = dataActive;
		const { courses: inactive_courses } = dataInactive;
		const { semesters } = dataSemesters;

		console.log(dataSemesters);

		return {
			props: {
				active_courses: active_courses ?? [],
				inactive_courses: inactive_courses ?? [],
				semesters: semesters ?? [],
			},
		};
	} catch (error) {
		return {
			props: {
				active_courses: [],
				inactive_courses: [],
				semesters: [],
			},
		};
	}
}
