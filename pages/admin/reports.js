import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addMOOCModel, editMOOCModel } from 'lib/yupmodels';
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
import { notify } from 'utils/notify';
import { groupBy } from 'lodash';
import { saveAs } from 'file-saver';
const ExcelJS = require('exceljs');

export default function AdminMOOCsPage({ semesters, dictSemesters }) {
	const Router = useRouter();

	const [selectedSemester, setSelectedSemester] = useState(-1);

	const handleReportDownload = async () => {
		try {
			if (selectedSemester === '-1' || selectedSemester === -1) {
				notify('warning', 'Please select a semester.');
				return;
			}

			const { data } = await axios.get(`/api/admin/get-simple-report-data`, {
				params: {
					semester: selectedSemester,
				},
			});

			const semesterData = data.semester_report;

			const dictSemesterData = groupBy(
				semesterData,
				({ enrollment_id }) => enrollment_id
			);

			console.log(dictSemesterData);

			// EXCEL DOWNLOAD STARTS HERE

			const BORDER_WIDTH = 'thin';

			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet();
			worksheet.columns = [
				{
					header: 'PROGRAM',
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
					header: 'DERS ADI (SAAT BİLGİSİ)\nEksik ise tamamlayınız',
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
					header: 'SERTİFİKA BAĞLANTISI\n(belirtiniz)',
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
					header: 'BAŞARAN ÖĞRENCİLER',
					key: 'sname',
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
					header:
						'DENEYİM\n(Lütfen Deneyiminizi, izlenimlerinizi ve bu uygulamanın daha iyi olması için önerilerinizi yazınız)',
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

			worksheet.getRow(1).height = 64;

			Object.entries(dictSemesterData).forEach(([key, value], i) => {
				const studentBundleMOOCs = value?.map(({ moocs }) => moocs).join('\n');

				const studentBundleCertificates = value
					?.map(({ certificate_url }) => certificate_url)
					.join('\n');

				// const studentBundleCertificates = value
				// 	?.map(
				// 		({ certificate_url }) => '=hyperlink("' + certificate_url + '")'
				// 	)
				// 	.join('\n');

				const row = worksheet.addRow([
					value[0]?.department,
					studentBundleMOOCs,
					studentBundleCertificates,
					value[0]?.student_name,
					value[0]?.comment,
				]);

				row.height = (row.height * 24) / row.width;
				row.font = { bold: false };

				// row.getCell(3).value = {
				// 	text: studentBundleCertificates,
				// 	hyperlink: studentBundleCertificates,
				// };

				row.getCell(2).alignment = {
					vertical: 'middle',
					horizontal: 'left',
					wrapText: true,
				};
				row.getCell(3).alignment = {
					vertical: 'middle',
					horizontal: 'left',
					wrapText: true,
				};
				row.getCell(5).alignment = {
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

			const buf = await workbook.xlsx.writeBuffer();
			const excelFilename =
				'MOOC_FINAL_REPORT_' +
				new Date().toLocaleDateString('tr-TR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}) +
				'-' +
				new Date().toLocaleTimeString('tr-TR', {}) +
				'.xlsx';
			saveAs(new Blob([buf]), excelFilename);

			notify('success', selectedSemester + ' Report downloaded successfully.');
		} catch (error) {
			console.log(error);
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

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Course Reports</PageTitle>

			<div className='w-full max-w-7xl mx-auto flex flex-col justify-center items-center'>
				<div className=''>
					<label className={classLabel} htmlFor='semester'>
						Semester
					</label>
					<select
						name='semester'
						id='semester'
						className={classInput}
						value={selectedSemester}
						onChange={(e) => {
							setSelectedSemester(() => e.target.value);
						}}
					>
						<option value={-1}>None</option>
						{!!dictSemesters &&
							Object.keys(dictSemesters).map((semester, i) => (
								<option key={i} value={semester}>
									{semester}
								</option>
							))}
					</select>
				</div>

				{!(selectedSemester !== -1 && selectedSemester !== '-1') && (
					<div className='w-full mt-8 mb-4 text-center text-xl text-zinc-600'>
						<span>
							In order to download a repot for the selected semester, select a
							semester from above.
						</span>
					</div>
				)}

				{selectedSemester !== -1 && selectedSemester !== '-1' && (
					<div className='w-full mt-8 mb-4 '>
						<KTable>
							<KTableHead
								tableHeaders={[
									{
										name: 'Department',
										alignment: 'left',
										className: 'rounded-tl-md',
									},
									{
										name: 'Course Code',
										alignment: 'left',
										className: 'rounded-tl-md',
									},
									{ name: 'Course Name', alignment: 'left', className: '' },
									{ name: 'Credits', alignment: 'center', className: '' },
									{
										name: 'Creation Date',
										alignment: 'center',
									},
									{
										name: 'Total Passed Students',
										alignment: 'center',
										className: 'rounded-tr-md',
									},
								]}
							/>
							<KTableBody>
								{dictSemesters[selectedSemester]?.map(
									(
										{
											department,
											course_code,
											name,
											credits,
											created_at,
											number_of_passed_students,
										},
										idx
									) => (
										<tr
											key={idx}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{department}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{course_code}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{name}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												{credits}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												<span>
													{created_at &&
														new Date(created_at).toLocaleTimeString('en-US', {
															timeZone: 'UTC',
														})}
													{created_at && ', '}
													{created_at &&
														new Date(created_at).toLocaleDateString('en-US', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
															timeZone: 'UTC',
														})}
												</span>
												{!created_at && 'Date not found'}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												{number_of_passed_students}
											</td>
										</tr>
									)
								)}
							</KTableBody>
						</KTable>
					</div>
				)}

				{selectedSemester !== -1 && selectedSemester !== '-1' && (
					<div className=' px-4 py-4 text-lg font-medium text-center '>
						<button
							onClick={() => handleReportDownload()}
							className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-emerald-800 hover:bg-emerald-600 border-none cursor-pointer transition-colors `}
						>
							DOWNLOAD SEMESTER REPORT
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/semesters`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { semesters } = data;

		const dictSemesters = groupBy(semesters, (sem) => sem.semester);

		return {
			props: {
				semesters,
				dictSemesters,
			},
		};
	} catch (error) {
		return {
			props: {
				semesters: [],
				dictSemesters: {},
			},
		};
	}
}
