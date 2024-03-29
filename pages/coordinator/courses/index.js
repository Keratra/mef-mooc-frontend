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
import { groupBy } from 'lodash';
import { notify } from 'utils/notify';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { saveAs } from 'file-saver';
const ExcelJS = require('exceljs');

export default function CoordinatorCoursesPage({
	active_courses,
	inactive_courses,
	semesters,
	dictActiveCourses,
	dictInactiveCourses,
}) {
	const Router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const [selectedTabs, setSelectedTabs] = useState(0); // tabs

	const handleAdd = async (
		{ course_code, name, type, semester, credits },
		{ setSubmitting }
	) => {
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
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeactivate = async (course_id) => {
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
			notify(
				'error',
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

	const handleDownload = async (selectedSemester) => {
		try {
			notify('info', selectedSemester);

			const { data } = await axios.get(
				`/api/coordinator/get-simple-report-data`,
				{
					params: {
						semester: selectedSemester,
					},
				}
			);

			const semesterData = data.bundles;

			const dictSemesterData = groupBy(
				semesterData,
				({ enrollment_id }) => enrollment_id
			);

			// console.log(dictSemesterData);

			// EXCEL DOWNLOAD STARTS HERE

			const BORDER_WIDTH = 'thin';

			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet();
			worksheet.columns = [
				{
					header: 'Student Name',
					key: 'sname',
					width: 24,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'left',
							wrapText: true,
						},
					},
				},
				{
					header: 'Student ID',
					key: 'sid',
					width: 16,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'MOOCs',
					key: 'moocs',
					width: 64,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'Total ECTS',
					key: 'credits',
					width: 16,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'Course Code',
					key: 'ccode',
					width: 16,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'Specific Elective Slot',
					key: 'ses',
					width: 16,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'Certificates',
					key: 'certif',
					width: 64,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
				{
					header: 'Bundle Feedback',
					key: 'feedback',
					width: 64,
					style: {
						font: {
							bold: true,
						},
						alignment: {
							vertical: 'middle',
							horizontal: 'center',
							wrapText: true,
						},
					},
				},
			];

			Object.entries(dictSemesterData).forEach(([key, value], i) => {
				const studentBundleMOOCs = value
					?.map(({ moocs }, index) => moocs)
					.join('\n');

				const studentBundleCertificates = value
					?.map(({ certificate_url }, index) => certificate_url)
					.join('\n');

				const row = worksheet.addRow([
					value[0]?.student_name,
					value[0]?.student_no,
					studentBundleMOOCs,
					value[0]?.total_ects,
					value[0]?.course_code,
					value[0]?.course_name,
					studentBundleCertificates,
					value[0]?.comment,
				]);

				row.height = (row.height * 24) / row.width;
				row.font = { bold: false };

				row.getCell(3).alignment = {
					vertical: 'middle',
					horizontal: 'left',
					wrapText: true,
				};
				row.getCell(7).alignment = {
					vertical: 'middle',
					horizontal: 'left',
					wrapText: true,
				};
				row.getCell(8).alignment = {
					vertical: 'middle',
					horizontal: 'left',
					wrapText: true,
				};

				row.getCell(1).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
				row.getCell(2).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
				row.getCell(3).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
				row.getCell(4).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
				row.getCell(5).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
				row.getCell(6).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
				row.getCell(7).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
				row.getCell(8).border = {
					top: { style: BORDER_WIDTH },
					left: { style: BORDER_WIDTH },
					bottom: { style: BORDER_WIDTH },
					right: { style: BORDER_WIDTH },
				};
			});

			worksheet.getCell('A1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('B1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('C1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('D1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('E1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('F1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('G1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('H1').fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'E2E2E2' },
			};

			worksheet.getCell('A1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			worksheet.getCell('B1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			worksheet.getCell('C1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			worksheet.getCell('D1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			worksheet.getCell('E1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			worksheet.getCell('F1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			worksheet.getCell('G1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			worksheet.getCell('H1').border = {
				top: { style: BORDER_WIDTH },
				left: { style: BORDER_WIDTH },
				bottom: { style: BORDER_WIDTH },
				right: { style: BORDER_WIDTH },
			};

			const buf = await workbook.xlsx.writeBuffer();
			const excelFilename =
				'MOOCsForFaculty_' +
				new Date().toLocaleDateString('tr-TR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}) +
				'-' +
				new Date().toLocaleTimeString('tr-TR', {}) +
				'.xlsx';
			saveAs(new Blob([buf]), excelFilename);
		} catch (error) {
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
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

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	// fall  : 8, 9, 10, 11, 12
	// summer: 6, 7
	// spring: 1, 2, 3, 4, 5

	let testSemester;

	if ([8, 9, 10, 11, 12].includes(currentMonth)) {
		testSemester = currentYear + '-' + (currentYear + 1) + '-' + 'Fall';
	} else if ([6, 7].includes(currentMonth)) {
		testSemester = currentYear - 1 + '-' + currentYear + '-' + 'Summer';
	} else if ([1, 2, 3, 4, 5].includes(currentMonth)) {
		testSemester = currentYear - 1 + '-' + currentYear + '-' + 'Spring';
	}

	let defaultSemester = 0;
	let startIndex = -1;

	for (let i = 0; i < semesters.length; i++) {
		if (semesters[i] === testSemester) {
			defaultSemester = semesters[i];
			startIndex = i;
		}
	}

	if (startIndex !== -1) {
		semesters = semesters.slice(startIndex);
	}

	return (
		<div className={`flex flex-col justify-center items-center`}>
			<PageTitle>Courses</PageTitle>

			<section className='w-full max-w-7xl px-2 pb-8 sm:px-0 font-sans transition-all '>
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
				<div className='w-full max-w-7xl mx-auto'>
					{Object.entries(dictActiveCourses)
						.map(([key, value], idx) => (
							<div key={idx} className='w-full'>
								<div className='flex justify-start items-center w-full mb-2'>
									<div className='mr-1'>
										{/* Print to Excel */}
										<div className='flex justify-center items-center'>
											<button
												className='
													text-green-800 hover:text-green-600 
													cursor-pointer rounded-full border-none
													transition-all duration-300 ease-in-out 
												'
												onClick={() => handleDownload(value[0]?.semester)}
											>
												<RiFileExcel2Fill className=' text-lg ' size={24} />
											</button>
										</div>
									</div>
									<h1 className='text-2xl font-semibold text-zinc-700'>
										{key}
										<span className='font-normal'> Semester Courses</span>
									</h1>
								</div>

								<div className='w-full overflow-x-auto mb-12'>
									<KTable>
										<KTableHead
											tableHeaders={[
												{
													name: 'Course Code',
													alignment: 'left',
													className: 'rounded-tl-md',
												},
												{ name: 'Name', alignment: 'left' },
												{ name: 'Credits', alignment: 'left' },
												{ name: 'Deactivate', alignment: 'center' },
												{
													name: 'View',
													alignment: 'center',
													className: 'rounded-tr-md',
												},
											]}
										></KTableHead>
										<KTableBody>
											{!!value &&
												value.map(
													(
														{
															id,
															course_code,
															name,
															semester,
															credits,
															is_active,
														},
														idx
													) => (
														<tr
															key={id}
															className={
																idx % 2 === 0
																	? 'bg-zinc-100'
																	: 'bg-zinc-200/[0.75]'
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
																	<button
																		className=' 
																			inline-flex justify-center items-center 
																			text-center text-lg text-white
																			py-2 px-2 
																			bg-transparent shadow-none 
																			font-thin rounded-full 
																			border-none cursor-pointer transition-colors'
																	>
																		<ChevronDoubleRightIcon className='h-7 w-7 text-indigo-700 hover:text-indigo-500 cursor-pointer transition-colors' />
																	</button>
																</NextLink>
															</td>
														</tr>
													)
												)}
										</KTableBody>
									</KTable>
								</div>
							</div>
						))
						.reverse()}

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
				<div className='w-full max-w-7xl mx-auto'>
					{Object.entries(dictInactiveCourses)
						.map(([key, value], idx) => (
							<div key={idx} className='w-full'>
								<div className='flex justify-start items-center w-full mb-2'>
									<div className='mr-1'>
										{/* Print to Excel */}
										<div className='flex justify-center items-center'>
											<button
												className='
													text-green-800 hover:text-green-600 
													cursor-pointer rounded-full border-none
													transition-all duration-300 ease-in-out 
												'
												onClick={() => handleDownload(value[0]?.semester)}
											>
												<RiFileExcel2Fill className=' text-lg ' size={24} />
											</button>
										</div>
									</div>
									<h1 className='text-2xl font-semibold text-zinc-700'>
										{key} <span className='font-normal'> Semester Courses</span>
									</h1>
								</div>

								<div className='w-full overflow-x-auto mb-12'>
									<KTable>
										<KTableHead
											tableHeaders={[
												{
													name: 'Course Code',
													alignment: 'left',
													className: 'rounded-tl-md',
												},
												{ name: 'Name', alignment: 'left' },
												{ name: 'Credits', alignment: 'left' },
												{
													name: 'View',
													alignment: 'center',
													className: 'rounded-tr-md',
												},
											]}
										></KTableHead>
										<KTableBody>
											{!!value &&
												value.map(
													(
														{
															id,
															course_code,
															name,
															semester,
															credits,
															is_active,
														},
														idx
													) => (
														<tr
															key={id}
															className={
																idx % 2 === 0
																	? 'bg-zinc-100'
																	: 'bg-zinc-200/[0.75]'
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
										</KTableBody>
									</KTable>
								</div>
							</div>
						))
						.reverse()}
				</div>
			)}

			<Modal
				{...{ isOpen, setIsOpen, closeModal, openModal }}
				title='Add a new course'
			>
				<div className=' transition-all mt-2 '>
					<Formik
						initialValues={{
							...addCourseModel.initials,
							semester: defaultSemester,
						}}
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
									type='number'
									name='credits'
									id='credits'
									min={1}
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

		const dictActiveCourses = groupBy(active_courses, (course) => {
			return course.semester;
		});

		const dictInactiveCourses = groupBy(inactive_courses, (course) => {
			return course.semester;
		});

		// {Object.entries(dictBundlesWA).map(([key, value], idx) => (

		return {
			props: {
				active_courses: active_courses ?? [],
				inactive_courses: inactive_courses ?? [],
				semesters: semesters ?? [],
				dictActiveCourses,
				dictInactiveCourses,
			},
		};
	} catch (error) {
		return {
			props: {
				active_courses: [],
				inactive_courses: [],
				semesters: [],
				dictActiveCourses: {},
				dictInactiveCourses: {},
			},
		};
	}
}
