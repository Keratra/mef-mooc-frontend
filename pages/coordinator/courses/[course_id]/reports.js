import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addCourseModel } from 'lib/yupmodels';
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
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { notify } from 'utils/notify';

const ExcelJS = require('exceljs');
import { saveAs } from 'file-saver';

export default function CoordinatorCoursePage({
	bundlesRB,
	bundlesWC,
	bundlesRC,
	bundlesAC,
	is_active,
	dictBundlesRB,
	dictBundlesWC,
	dictBundlesRC,
	dictBundlesAC,
	currentCourse,
}) {
	const Router = useRouter();

	const [selectedTabs, setSelectedTabs] = useState(0); // tabs

	const { course_id } = Router.query;

	const handleDownload = async () => {
		try {
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
					header: 'Dept.',
					key: 'dept',
					width: 24,
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

			Object.entries(dictBundlesAC).forEach(([key, value], i) => {
				const studentBundleMOOCs = value
					?.map(
						(
							{
								bundle_id,
								student_no,
								student_name,
								student_surname,
								mooc_name,
								mooc_url,
								certificate_url,
								bundle_created_at,
							},
							index
						) => mooc_name
					)
					.join('\n');

				const studentBundleCertificates = value
					?.map(
						(
							{
								bundle_id,
								student_no,
								student_name,
								student_surname,
								mooc_name,
								mooc_url,
								certificate_url,
								bundle_created_at,
							},
							index
						) => mooc_url
					)
					.join('\n');

				const row = worksheet.addRow([
					value[0]?.student_name + ' ' + value[0]?.student_surname,
					value[0]?.student_no,
					currentCourse?.department_name,
					studentBundleMOOCs,
					currentCourse?.credits,
					currentCourse?.course_code,
					currentCourse?.name,
					studentBundleCertificates,
					value[0]?.comment,
				]);

				row.height = (row.height * 24) / row.width;
				row.font = { bold: false };

				row.getCell(4).alignment = {
					vertical: 'middle',
					horizontal: 'left',
					wrapText: true,
				};
				row.getCell(8).alignment = {
					vertical: 'middle',
					horizontal: 'left',
					wrapText: true,
				};
				row.getCell(9).alignment = {
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
				row.getCell(9).border = {
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

			worksheet.getCell('I1').fill = {
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

			worksheet.getCell('I1').border = {
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

	const tabs = [{ name: 'General Report' }, { name: 'Finished Report' }];

	return (
		<div className='flex flex-col justify-center items-center'>
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
								true
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
								false
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

			{!is_active && (
				<div className='min-w-[95%] mt-4 mx-4 p-3 bg-gradient-to-t from-rose-100 to-rose-50 rounded-lg shadow-md text-3xl text-rose-600 text-center font-bold'>
					This is an inactive course!
				</div>
			)}

			{selectedTabs === 0 && (
				<div className='w-[95%]'>
					{
						<PageTitle>
							Bundles that are waiting for certificate uploads
						</PageTitle>
					}
					{Object.keys(dictBundlesWC)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesWC).map(([key, value], i) => (
						<div
							key={i}
							className='
								max-w-7xl mx-auto 
								mt-4 mb-8 p-2 hover:mb-12
								flex flex-col
								bg-slate-100 rounded-lg
								border-solid border-2
								border-slate-200 hover:border-slate-300
								shadow-lg hover:shadow-2xl
								transition-all
							'
						>
							<div className='-mt-6 -ml-6 max-w-max h-8 px-3 flex justify-center items-center rounded-full bg-teal-200 shadow-lg text-xl font-bold'>
								<span className='font-semibold'>{value[0]?.student_no}</span>
								<span className='font-normal ml-2'>
									{value[0]?.student_name} {value[0]?.student_surname}
								</span>
							</div>

							{value?.map(
								(
									{
										bundle_id,
										student_no,
										student_name,
										student_surname,
										mooc_name,
										mooc_url,
										certificate_url,
										bundle_created_at,
									},
									index
								) => (
									<div
										key={index}
										className='
											mt-2 p-1 w-full
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
											<span className='select-none text-black no-underline'>
												-&gt;
											</span>
											<span className='text-blue-600 hover:underline underline-offset-2'>
												{mooc_name}
											</span>
										</NextLink>

										{!!certificate_url ? (
											<NextLink
												href={certificate_url ?? ''}
												className='ml-4 font-semibold text-indigo-600 hover:underline underline-offset-2'
											>
												Certificate
											</NextLink>
										) : (
											<span className='text-neutral-600'>
												No certificate was found...
											</span>
										)}
									</div>
								)
							)}

							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								Accepted by {value[0]?.coordinator_name} at{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleDateString(
									'en-US',
									{
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										timeZone: 'UTC',
									}
								)}{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleTimeString(
									'en-US',
									{
										timeZone: 'UTC',
									}
								)}
							</div>

							{/* <div className='my-4 flex justify-evenly items-center'>
								<button
									onClick={() => handleRejectBundle(key)}
									className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-rose-500 bg-rose-700 text-rose-50 transition-colors'
								>
									<span className='drop-shadow-md'>Reject</span>
								</button>
								<button
									onClick={() => handleApproveBundle(key)}
									className='px-5 py-1 font-semibold text-xl uppercase border-none shadow-lg cursor-pointer rounded-lg hover:bg-emerald-500 bg-emerald-700 text-emerald-50 transition-colors'
								>
									<span className='drop-shadow-md'>Approve</span>
								</button>
							</div> */}
						</div>
					))}
				</div>
			)}

			{selectedTabs === 0 && (
				<div className='w-[95%]'>
					{
						<PageTitle>
							Bundles that were rejected during bundle submissions
						</PageTitle>
					}
					{Object.keys(dictBundlesRB)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesRB).map(([key, value], i) => (
						<div
							key={i}
							className='
								max-w-7xl mx-auto 
								mt-4 mb-8 p-2 hover:mb-12
								flex flex-col
								bg-slate-100 rounded-lg
								border-solid border-2
								border-slate-200 hover:border-slate-300
								shadow-lg hover:shadow-2xl
								transition-all
							'
						>
							<div className='-mt-6 -ml-6 max-w-max h-8 px-3 flex justify-center items-center rounded-full bg-teal-200 shadow-lg text-xl font-bold'>
								<span className='font-semibold'>{value[0]?.student_no}</span>
								<span className='font-normal ml-2'>
									{value[0]?.student_name} {value[0]?.student_surname}
								</span>
							</div>

							{value?.map(
								(
									{
										bundle_id,
										student_no,
										student_name,
										student_surname,
										mooc_name,
										mooc_url,
										certificate_url,
										bundle_created_at,
									},
									index
								) => (
									<div
										key={index}
										className='
											mt-2 p-1 w-full
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
											<span className='select-none text-black no-underline'>
												-&gt;
											</span>
											<span className='text-blue-600 hover:underline underline-offset-2'>
												{mooc_name}
											</span>
										</NextLink>

										{!!certificate_url && (
											<NextLink
												href={certificate_url ?? ''}
												className='ml-4 font-semibold text-indigo-600 hover:underline underline-offset-2'
											>
												Certificate
											</NextLink>
										)}
									</div>
								)
							)}

							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								Accepted by {value[0]?.coordinator_name} at{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleDateString(
									'en-US',
									{
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										timeZone: 'UTC',
									}
								)}{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleTimeString(
									'en-US',
									{
										timeZone: 'UTC',
									}
								)}
							</div>
						</div>
					))}
				</div>
			)}
			{selectedTabs === 0 && (
				<div className='w-[95%]'>
					{
						<PageTitle>
							Bundles that were rejected after certificates were uploaded
						</PageTitle>
					}
					{Object.keys(dictBundlesRC)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesRC).map(([key, value], i) => (
						<div
							key={i}
							className='
								max-w-7xl mx-auto 
								mt-4 mb-8 p-2 hover:mb-12
								flex flex-col
								bg-slate-100 rounded-lg
								border-solid border-2
								border-slate-200 hover:border-slate-300
								shadow-lg hover:shadow-2xl
								transition-all
							'
						>
							<div className='-mt-6 -ml-6 max-w-max h-8 px-3 flex justify-center items-center rounded-full bg-teal-200 shadow-lg text-xl font-bold'>
								<span className='font-semibold'>{value[0]?.student_no}</span>
								<span className='font-normal ml-2'>
									{value[0]?.student_name} {value[0]?.student_surname}
								</span>
							</div>

							{value?.map(
								(
									{
										bundle_id,
										student_no,
										student_name,
										student_surname,
										mooc_name,
										mooc_url,
										certificate_url,
										bundle_created_at,
									},
									index
								) => (
									<div
										key={index}
										className='
											mt-2 p-1 w-full
											grid grid-cols-3 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className=''>
											<span className='select-none text-black no-underline'>
												-&gt;
											</span>
											<span className='text-blue-600 hover:underline underline-offset-2'>
												{mooc_name}
											</span>
										</NextLink>

										{!!certificate_url && (
											<NextLink
												href={certificate_url ?? ''}
												className='ml-4 font-semibold text-indigo-600 hover:underline underline-offset-2'
											>
												Certificate
											</NextLink>
										)}
									</div>
								)
							)}

							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								Accepted by {value[0]?.coordinator_name} at{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleDateString(
									'en-US',
									{
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										timeZone: 'UTC',
									}
								)}{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleTimeString(
									'en-US',
									{
										timeZone: 'UTC',
									}
								)}
							</div>
						</div>
					))}
				</div>
			)}
			{selectedTabs === 1 && (
				<div className='w-[95%]'>
					<div>
						{/* Print to Excel */}
						<div className='flex justify-center items-center'>
							<button
								className='
									p-3 bg-white 
									border-solid border
									border-green-600 hover:border-green-400
									text-green-600 hover:text-green-400 
									shadow-md hover:shadow-xl 
									cursor-pointer rounded-full 
									transition-all duration-300 ease-in-out 
								'
								onClick={handleDownload}
							>
								<RiFileExcel2Fill className=' text-lg ' size={36} />
							</button>
						</div>
					</div>
					{Object.keys(dictBundlesAC)?.length === 0 && (
						<div className='mt-4 w-full text-center text-neutral-700'>
							No bundles were found...
						</div>
					)}
					{Object.entries(dictBundlesAC).map(([key, value], i) => (
						<div
							key={i}
							className='
								max-w-7xl mx-auto 
								mt-4 mb-8 p-2 hover:mb-12
								flex flex-col
								bg-slate-100 rounded-lg
								border-solid border-2
								border-slate-200 hover:border-slate-300
								shadow-lg hover:shadow-2xl
								transition-all
							'
						>
							<div className='-mt-6 -ml-6 max-w-max h-8 px-3 flex justify-center items-center rounded-full bg-teal-200 shadow-lg text-xl font-bold'>
								<span className='font-semibold'>{value[0]?.student_no}</span>
								<span className='font-normal ml-2'>
									{value[0]?.student_name} {value[0]?.student_surname}
								</span>
							</div>

							{value?.map(
								(
									{
										bundle_id,
										student_no,
										student_name,
										student_surname,
										mooc_name,
										mooc_url,
										certificate_url,
										bundle_created_at,
									},
									index
								) => (
									<div
										key={index}
										className='
											mt-2 p-1 w-full
											grid grid-cols-4 gap-4
										'
									>
										<NextLink href={mooc_url ?? ''} className='col-span-3'>
											<span className='select-none text-black no-underline'>
												-&gt;
											</span>
											<span className='text-blue-600 hover:underline underline-offset-2'>
												{mooc_name}
											</span>
										</NextLink>

										{!!certificate_url && (
											<NextLink
												href={certificate_url ?? ''}
												className='ml-4 font-semibold text-indigo-600 hover:underline underline-offset-2'
											>
												Certificate
											</NextLink>
										)}
									</div>
								)
							)}

							<div className='max-w-4xl mx-auto mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								<span className='font-semibold'>
									Bundle Feedback of Student
								</span>
							</div>

							<div className='max-w-4xl mx-auto mt-2 px-2 text-justify text-neutral-700 drop-shadow-md'>
								{value[0]?.comment}
							</div>

							<div className='mt-6 px-2 text-center text-neutral-700 drop-shadow-md'>
								Bundle accepted by{' '}
								<span className='font-semibold'>
									Coordinator {value[0]?.coordinator_name} at
								</span>{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleDateString(
									'en-US',
									{
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										timeZone: 'UTC',
									}
								)}{' '}
								{new Date(value[0]?.bundle_created_at).toLocaleTimeString(
									'en-US',
									{
										timeZone: 'UTC',
									}
								)}
							</div>
							<div className='mt-2 px-2 text-center text-neutral-700 drop-shadow-md'>
								Certificates approved by{' '}
								<span className='font-semibold'>
									Coordinator {value[0]?.coordinator_name} at
								</span>{' '}
								{new Date(value[0]?.pass_date).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									timeZone: 'UTC',
								})}{' '}
								{new Date(value[0]?.pass_date).toLocaleTimeString('en-US', {
									timeZone: 'UTC',
								})}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const token = req.cookies.token;
		const { course_id } = query;
		const backendURLrb = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/rejected-bundles`;
		const backendURLwc = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-certificates`;
		const backendURLrc = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/rejected-certificates`;
		const backendURLac = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/accepted-certificates`;

		const backendURLActive = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/active-courses`;
		const backendURLInactive = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/inactive-courses`;

		const backendURLdep = `${process.env.NEXT_PUBLIC_API_URL}/general/all-departments`;

		const { data: dataRB } = await axios.get(backendURLrb, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataWC } = await axios.get(backendURLwc, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataRC } = await axios.get(backendURLrc, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataAC } = await axios.get(backendURLac, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

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

		const { data: dataDep } = await axios.get(backendURLdep, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { bundles: bundlesRB } = dataRB;
		const { bundles: bundlesWC } = dataWC;
		const { bundles: bundlesRC } = dataRC;
		const { bundles: bundlesAC, is_active } = dataAC;

		const { courses: active_courses } = dataActive;
		const { courses: inactive_courses } = dataInactive;

		const { departments } = dataDep;

		let currentCourse;

		if (is_active) {
			currentCourse = active_courses?.filter(
				(course) => parseInt(course.id) === parseInt(course_id)
			)[0];
		} else {
			currentCourse = inactive_courses?.filter(
				(course) => parseInt(course.id) === parseInt(course_id)
			)[0];
		}

		currentCourse['department_name'] = departments.filter(
			(department) => department.id === currentCourse.department_id
		)[0].name;

		const dictBundlesRB = groupBy(bundlesRB, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesWC = groupBy(bundlesWC, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesRC = groupBy(bundlesRC, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesAC = groupBy(bundlesAC, (bundle) => {
			return bundle.bundle_id;
		});

		return {
			props: {
				bundlesRB,
				bundlesWC,
				bundlesRC,
				bundlesAC,
				is_active,
				dictBundlesRB,
				dictBundlesWC,
				dictBundlesRC,
				dictBundlesAC,
				currentCourse,
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				bundlesRB: [],
				bundlesWA: [],
				bundlesRC: [],
				bundlesAC: [],
				is_active: true,
				dictBundlesRB: {},
				dictBundlesWC: {},
				dictBundlesRC: {},
				dictBundlesAC: {},
				currentCourse: {},
			},
		};
	}
}
