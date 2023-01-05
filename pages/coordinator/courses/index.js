import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addCourseModel } from 'lib/yupmodels';
import axios from 'axios';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { useRouter } from 'next/router';

export default function CoordinatorCoursesPage({
	active_courses,
	inactive_courses,
	semesters,
}) {
	const Router = useRouter();

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

	return (
		<div className='flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mt-12 mb-4 drop-shadow-md'>
				Active Courses
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
								<span className='text-center drop-shadow-md'>Credits</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Semester</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Deactivate</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>View</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!active_courses &&
							active_courses.map(
								({ id, course_code, name, semester, credits, is_active }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{course_code}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{name}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{credits}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{semester}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => handleDeactivate(id)}
												className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-rose-800 hover:bg-rose-600 border-none cursor-pointer transition-colors`}
											>
												X
											</button>
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<NextLink href={`/coordinator/courses/${id}`}>
												<button className='text-center text-lg py-2 px-2 bg-blue-800 hover:bg-blue-600 shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
													GO
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
					</tbody>
				</table>
			</div>

			<div
				className={`max-w-md md:max-w-2xl mx-auto mt-12 mb-2 md:px-6 transition-all shadow-lg border-solid border-neutral-200 hover:border-neutral-300 rounded-md `}
			>
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
							<h2 className='md:col-span-2 mt-4 text-center text-3xl drop-shadow-md'>
								Add a new Course
							</h2>

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

			<h1 className='text-center text-5xl mt-12 mb-4 drop-shadow-md text-rose-900'>
				Inactive Courses
			</h1>

			<div className='flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg mb-12'>
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
								<span className='text-center drop-shadow-md'>Credits</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Semester</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>View</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!inactive_courses &&
							inactive_courses.map(
								({ id, course_code, name, semester, credits, is_active }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200 text-rose-900'
									>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{course_code}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{name}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{credits}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
											{semester}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<NextLink href={`/coordinator/courses/${id}`}>
												<button className='text-center text-lg py-2 px-2 bg-orange-800 hover:bg-orange-600 shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'>
													GO
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
