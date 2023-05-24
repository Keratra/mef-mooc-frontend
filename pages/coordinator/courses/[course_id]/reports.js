import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { editBundleFeedbackModel, editBundleMoocAddModel } from 'lib/yupmodels';
import axios from 'axios';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { useRouter } from 'next/router';
import { groupBy } from 'lodash';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import {
	UsersIcon,
	UserMinusIcon,
	PencilSquareIcon,
	TrashIcon,
	ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import Tabs from '@components/Tabs';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import {
	FiChevronLeft,
	FiChevronRight,
	FiChevronDown,
	FiChevronUp,
} from 'react-icons/fi';
import { FiCheckCircle, FiXCircle, FiDown } from 'react-icons/fi';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { notify } from 'utils/notify';
import Multiselect from 'multiselect-react-dropdown';
import { MdDeleteForever } from 'react-icons/md';

const ExcelJS = require('exceljs');
import { saveAs } from 'file-saver';

export default function CoordinatorCoursePage({
	bundlesWB,
	bundlesWA,
	bundlesRB,
	bundlesWC,
	bundlesRC,
	bundlesAC,
	is_active,
	dictBundlesRB,
	dictBundlesWC,
	dictBundlesRC,
	dictBundlesAC,
	dictBundlesWB,
	dictBundlesWA,
	currentCourse,
	course,
	students,
	waiting_students,
	moocs,
}) {
	const Router = useRouter();

	const [selectedTabs, setSelectedTabs] = useState(0);
	const [selectedDetail, setSelectedDetail] = useState(0);
	const [selectedModalTab, setSelectedModalTab] = useState(0);
	const [dateHolder, setDateHolder] = useState({});
	const [isOpen, setIsOpen] = useState(false);
	const [sortStatus, setSortStatus] = useState(false);
	const [selected, setSelected] = useState(0);
	const [selectedMooc, setSelectedMooc] = useState([]);
	const [selectedBundle, setSelectedBundle] = useState([
		{
			bundle_id: '',
			student_id: '',
			student_no: '',
			student_name: '',
			student_surname: '',
			mooc_name: '',
			mooc_url: '',
			certificate_url: '',
			bundle_created_at: '',
		},
	]);

	const { course_id } = Router.query;

	useEffect(() => {
		// Object.entries(dictBundlesAC)
		// 	.filter(
		// 		([key, value]) =>
		// 			parseInt(value[0].student_id) === parseInt(selectedDetail)
		// 	)
		// 	.map(([key, value], idx) => value)[0][0];

		{
			Object.entries(dictBundlesAC).filter(
				([key, value]) =>
					parseInt(value[0].student_id) === parseInt(selectedDetail)
			).length !== 0
				? setDateHolder(
						Object.entries(dictBundlesAC)
							.filter(
								([key, value]) =>
									parseInt(value[0].student_id) === parseInt(selectedDetail)
							)
							.map(([key, value], idx) => value)[0][0]
				  )
				: Object.entries(dictBundlesWA).filter(
						([key, value]) =>
							parseInt(value[0].student_id) === parseInt(selectedDetail)
				  ).length !== 0
				? setDateHolder(
						Object.entries(dictBundlesWA)
							.filter(
								([key, value]) =>
									parseInt(value[0].student_id) === parseInt(selectedDetail)
							)
							.map(([key, value], idx) => value)[0][0]
				  )
				: Object.entries(dictBundlesWC).filter(
						([key, value]) =>
							parseInt(value[0].student_id) === parseInt(selectedDetail)
				  ).length !== 0
				? setDateHolder(
						Object.entries(dictBundlesWC)
							.filter(
								([key, value]) =>
									parseInt(value[0].student_id) === parseInt(selectedDetail)
							)
							.map(([key, value], idx) => value)[0][0]
				  )
				: Object.entries(dictBundlesWB).filter(
						([key, value]) =>
							parseInt(value[0].student_id) === parseInt(selectedDetail)
				  ).length !== 0
				? setDateHolder(
						Object.entries(dictBundlesWB)
							.filter(
								([key, value]) =>
									parseInt(value[0].student_id) === parseInt(selectedDetail)
							)
							.map(([key, value], idx) => value)[0][0]
				  )
				: Object.entries(dictBundlesRB).filter(
						([key, value]) =>
							parseInt(value[0].student_id) === parseInt(selectedDetail)
				  ).length !== 0
				? setDateHolder(
						Object.entries(dictBundlesRB)
							.filter(
								([key, value]) =>
									parseInt(value[0].student_id) === parseInt(selectedDetail)
							)
							.map(([key, value], idx) => value)[0][0]
				  )
				: setDateHolder(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDetail]);

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

	function openModal() {
		setIsOpen(true);
	}
	function closeModal() {
		setIsOpen(false);
	}

	const getBundleDetails = async (bundle_id) => {
		try {
			const { data } = await axios.get(`/api/coordinator/get-bundle`, {
				params: {
					course_id,
					bundle_id,
				},
			});

			const bundle = data?.bundle;

			setSelectedBundle(bundle);
			openModal();
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
			notify(
				'error',
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
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message ??
					'Error'
			);
		}
	};

	const handleAddMooc = async (values, { setSubmitting }) => {
		try {
			const { data } = await axios.post(`/api/coordinator/add-bundle-mooc`, {
				course_id,
				bundle_id: selected,
				mooc_id: selectedMooc[0].id,
			});

			notify('success', 'MOOC added successfully');

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
			setSelectedMooc([]);
			setSubmitting(false);
		}
	};

	const handleDeleteMooc = async (bundle_detail_id) => {
		try {
			if (!confirm('Are you sure about removing this MOOC?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/coordinator/remove-bundle-mooc`, {
				course_id,
				bundle_id: selected,
				bundle_detail_id,
			});

			notify('success', 'MOOC removed successfully');

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

	const handleEditCertificate = async (bundle_detail_id) => {
		try {
			const certificate_url = prompt('Please enter the new certificate url');

			// if (!certificate_url) throw new Error('Certificate url is required');

			await axios.post(`/api/coordinator/edit-certificate`, {
				course_id,
				bundle_id: selected,
				bundle_detail_id,
				certificate_url,
			});

			notify('success', 'Certificate url updated successfully');

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

	const handleCommentChange = async ({ comment }, { setSubmitting }) => {
		try {
			if (!comment) throw new Error('Comment is required');

			if (comment.length > 2000)
				throw new Error('Comment is too long, max 2000 chars');

			await axios.post(`/api/coordinator/edit-feedback`, {
				course_id,
				bundle_id: selected,
				comment,
			});

			notify('success', 'Feedback updated successfully');

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

	const handleSelect = (selectedList, selectedItem) => {
		try {
			if (
				Object.values(selectedMooc)
					.map(({ id }) => id)
					.includes(selectedItem.id)
			) {
				notify('warning', 'Already added the selected MOOC');
				return;
			}
			setSelectedMooc(() => [selectedItem]);
		} catch (error) {
			notify('error', 'Error adding MOOC');
		}
	};

	const handleRemove = (selectedList, selectedItem) => {
		try {
			setSelectedMooc(() =>
				selectedMooc.filter((item) => item.id !== selectedItem.id)
			);
		} catch (error) {
			notify('error', 'Error removing MOOC');
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

	const tabs = [{ name: 'All Students' }, { name: 'Passed Students Report' }];

	students.sort(function (a, b) {
		let op1;
		let op2;

		if (
			Object.entries(dictBundlesAC).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(a.id)
			).length !== 0
		) {
			op1 = 5;
		} else if (
			Object.entries(dictBundlesWA).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(a.id)
			).length !== 0
		) {
			op1 = 4;
		} else if (
			Object.entries(dictBundlesWC).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(a.id)
			).length !== 0
		) {
			op1 = 3;
		} else if (
			Object.entries(dictBundlesWB).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(a.id)
			).length !== 0
		) {
			op1 = 2;
		} else if (
			Object.entries(dictBundlesRB).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(a.id)
			).length !== 0
		) {
			op1 = 1;
		} else {
			op1 = 0;
		}

		if (
			Object.entries(dictBundlesAC).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(b.id)
			).length !== 0
		) {
			op2 = 5;
		} else if (
			Object.entries(dictBundlesWA).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(b.id)
			).length !== 0
		) {
			op2 = 4;
		} else if (
			Object.entries(dictBundlesWC).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(b.id)
			).length !== 0
		) {
			op2 = 3;
		} else if (
			Object.entries(dictBundlesWB).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(b.id)
			).length !== 0
		) {
			op2 = 2;
		} else if (
			Object.entries(dictBundlesRB).filter(
				([key, value]) => parseInt(value[0].student_id) === parseInt(b.id)
			).length !== 0
		) {
			op2 = 1;
		} else {
			op2 = 0;
		}

		return (sortStatus ? 1 : -1) * (op1 - op2);
	});

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
							<span className='drop-shadow-md select-none '>Actions</span>
						</div>
					</NextLink>
				</div>
			</section>

			<Tabs {...{ selectedTabs, setSelectedTabs, tabs, fullWidth: false }} />

			{selectedTabs === 0 && (
				<div className='w-[95%] flex flex-col overflow-x-auto shadow-lg mb-12'>
					<KTable>
						<KTableHead
							tableHeaders={[
								{
									name: 'History',
									alignment: 'center',
									className: 'rounded-tl-md w-[2.5rem]',
								},
								{
									name: 'Student No',
									alignment: 'left',
									className: '',
								},
								{ name: 'Name', alignment: 'left' },
								{ name: 'Email', alignment: 'left', className: '' },
								{
									name: (
										<div
											onClick={() => setSortStatus((prev) => !prev)}
											className='flex justify-center items-center gap-x-2'
										>
											<span>Status</span>

											{sortStatus ? (
												<HiSortAscending size={20} className='' />
											) : (
												<HiSortDescending size={20} className='' />
											)}
										</div>
									),
									alignment: 'center',
									className: '',
								},
								{
									name: 'Enroll Date',
									alignment: 'left',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{!!students &&
								students.map(
									(
										{ id, name, surname, email, student_no, enroll_date },
										idx
									) => (
										<>
											<tr
												key={id}
												className={
													idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
												}
											>
												<td className='px-4 py-4 text-lg font-medium whitespace-nowrap text-center '>
													{parseInt(selectedDetail) === parseInt(id) ? (
														<FiChevronUp
															onClick={() => setSelectedDetail(0)}
															className='
																w-9 h-9 
																text-zinc-600 hover:bg-white 
																border-solid border 
																border-transparent hover:border-zinc-400 
																cursor-pointer rounded-sm 
																transition-all duration-75 '
														/>
													) : (
														<FiChevronDown
															onClick={() => setSelectedDetail(id)}
															className='
																w-9 h-9 
																text-zinc-600 hover:bg-white 
																border-solid border 
																border-transparent hover:border-zinc-400 
																cursor-pointer rounded-sm 
																transition-all duration-75 '
														/>
													)}
												</td>
												<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
													{student_no}
												</td>
												<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
													{name} {surname}
												</td>
												<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
													{email}
												</td>
												<td className='px-4 py-4 text-lg font-medium whitespace-nowrap text-center '>
													{Object.entries(dictBundlesAC).filter(
														([key, value]) =>
															parseInt(value[0].student_id) === parseInt(id)
													).length !== 0 ? (
														<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-emerald-500'>
															<span className='drop-shadow-lg'>
																PASSED COURSE
															</span>
														</span>
													) : Object.entries(dictBundlesWA).filter(
															([key, value]) =>
																parseInt(value[0].student_id) === parseInt(id)
													  ).length !== 0 ? (
														<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-sky-500'>
															<span className='drop-shadow-lg'>
																Waiting Certificates Approval
															</span>
														</span>
													) : Object.entries(dictBundlesWC).filter(
															([key, value]) =>
																parseInt(value[0].student_id) === parseInt(id)
													  ).length !== 0 ? (
														<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-yellow-500'>
															<span className='drop-shadow-lg'>
																Waiting Certificates Upload
															</span>
														</span>
													) : Object.entries(dictBundlesWB).filter(
															([key, value]) =>
																parseInt(value[0].student_id) === parseInt(id)
													  ).length !== 0 ? (
														<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-amber-600'>
															<span className='drop-shadow-lg'>
																Waiting Bundle Approval
															</span>
														</span>
													) : Object.entries(dictBundlesRB).filter(
															([key, value]) =>
																parseInt(value[0].student_id) === parseInt(id)
													  ).length !== 0 ? (
														<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-rose-500'>
															<span className='drop-shadow-lg'>
																Rejected Bundle Submission
															</span>
														</span>
													) : (
														<span className='uppercase py-1 px-2 font-bold text-center rounded-xl text-white bg-zinc-500'>
															<span className='drop-shadow-lg'>
																JUST ENROLLED
															</span>
														</span>
													)}
												</td>
												<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
													<span>
														{enroll_date &&
															new Date(enroll_date).toLocaleDateString(
																'en-US',
																{
																	year: 'numeric',
																	month: 'long',
																	day: 'numeric',
																	timeZone: 'UTC',
																}
															)}
													</span>
													{enroll_date && ', '}
													<span>
														{enroll_date &&
															new Date(enroll_date).toLocaleTimeString(
																'en-US',
																{
																	timeZone: 'UTC',
																}
															)}
													</span>
													{!enroll_date && 'Date not found'}
												</td>
											</tr>
											{/* DETAILS OF STUDENTS BUNDLE HISTORY */}
											<tr
												key={'d' + id}
												className={
													' transition-all bg-zinc-200 ' +
													(parseInt(selectedDetail) === parseInt(id)
														? 'h-4'
														: 'h-0 overflow-hidden')
												}
											>
												<td
													colSpan={6}
													className={
														' transition-all border-solid border-0 border-zinc-700/[0.5] ' +
														(parseInt(selectedDetail) === parseInt(id)
															? ' p-4 px-28 border-y '
															: '')
													}
												>
													{parseInt(selectedDetail) === parseInt(id) && (
														<section className=''>
															<div className='grid grid-cols-7 gap-2 gap-y-4'>
																<div className='text-right font-semibold'>
																	Enroll Date:
																</div>
																<div className='col-span-6'>
																	<span>
																		{enroll_date &&
																			new Date(enroll_date).toLocaleTimeString(
																				'en-US',
																				{
																					timeZone: 'UTC',
																				}
																			)}
																		{enroll_date && ', '}
																		{enroll_date &&
																			new Date(enroll_date).toLocaleDateString(
																				'en-US',
																				{
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				}
																			)}
																	</span>
																	{!enroll_date && 'Date not found'}
																</div>

																<div className='text-right font-semibold'>
																	{Object.entries(dictBundlesAC).filter(
																		([key, value]) =>
																			parseInt(value[0].student_id) ===
																			parseInt(id)
																	).length !== 0
																		? 'Bundle Create Date:'
																		: Object.entries(dictBundlesWA).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? 'Bundle Create Date:'
																		: Object.entries(dictBundlesWC).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? 'Bundle Create Date:'
																		: Object.entries(dictBundlesWB).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? 'Bundle Create Date:'
																		: Object.entries(dictBundlesRB).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? ''
																		: ''}
																</div>
																<div className='col-span-6'>
																	{Object.entries(dictBundlesAC).filter(
																		([key, value]) =>
																			parseInt(value[0].student_id) ===
																			parseInt(id)
																	).length !== 0 ? (
																		<div>
																			{dateHolder?.student_bundle_create_date &&
																				new Date(
																					dateHolder?.student_bundle_create_date
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.student_bundle_create_date &&
																				', '}
																			{dateHolder?.student_bundle_create_date &&
																				new Date(
																					dateHolder?.student_bundle_create_date
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.student_bundle_create_date &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWA).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		<div>
																			{dateHolder?.student_bundle_create_date &&
																				new Date(
																					dateHolder?.student_bundle_create_date
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.student_bundle_create_date &&
																				', '}
																			{dateHolder?.student_bundle_create_date &&
																				new Date(
																					dateHolder?.student_bundle_create_date
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.student_bundle_create_date &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWC).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		<div>
																			{dateHolder?.student_bundle_create_date &&
																				new Date(
																					dateHolder?.student_bundle_create_date
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.student_bundle_create_date &&
																				', '}
																			{dateHolder?.student_bundle_create_date &&
																				new Date(
																					dateHolder?.student_bundle_create_date
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.student_bundle_create_date &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWB).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		<div>
																			{dateHolder?.bundle_created_at &&
																				new Date(
																					dateHolder?.bundle_created_at
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.bundle_created_at && ', '}
																			{dateHolder?.bundle_created_at &&
																				new Date(
																					dateHolder?.bundle_created_at
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.bundle_created_at &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesRB).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		''
																	) : (
																		''
																	)}
																</div>

																<div className='text-right font-semibold'>
																	{Object.entries(dictBundlesAC).filter(
																		([key, value]) =>
																			parseInt(value[0].student_id) ===
																			parseInt(id)
																	).length !== 0
																		? 'Bundle Accept Date:'
																		: Object.entries(dictBundlesWA).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? 'Bundle Accept Date:'
																		: Object.entries(dictBundlesWC).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? 'Bundle Accept Date:'
																		: Object.entries(dictBundlesWB).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? ''
																		: Object.entries(dictBundlesRB).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? ''
																		: ''}
																</div>
																<div className='col-span-6'>
																	{Object.entries(dictBundlesAC).filter(
																		([key, value]) =>
																			parseInt(value[0].student_id) ===
																			parseInt(id)
																	).length !== 0 ? (
																		<div>
																			Bundle approved by{' '}
																			<span className='font-semibold'>
																				{dateHolder?.bundle_coordinator &&
																					dateHolder?.bundle_coordinator}{' '}
																			</span>{' '}
																			at{' '}
																			{dateHolder?.bundle_date &&
																				new Date(
																					dateHolder?.bundle_date
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.bundle_date && ', '}
																			{dateHolder?.bundle_date &&
																				new Date(
																					dateHolder?.bundle_date
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.bundle_date &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWA).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		<div>
																			Bundle approved by{' '}
																			<span className='font-semibold'>
																				{dateHolder?.bundle_coordinator &&
																					dateHolder?.bundle_coordinator}{' '}
																			</span>{' '}
																			at{' '}
																			{dateHolder?.bundle_date &&
																				new Date(
																					dateHolder?.bundle_date
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.bundle_date && ', '}
																			{dateHolder?.bundle_date &&
																				new Date(
																					dateHolder?.bundle_date
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.bundle_date &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWC).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		<div>
																			Bundle approved by{' '}
																			<span className='font-semibold'>
																				{dateHolder?.coordinator_name &&
																					dateHolder?.coordinator_name}{' '}
																			</span>{' '}
																			at{' '}
																			{dateHolder?.bundle_created_at &&
																				new Date(
																					dateHolder?.bundle_created_at
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.bundle_created_at && ', '}
																			{dateHolder?.bundle_created_at &&
																				new Date(
																					dateHolder?.bundle_created_at
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.bundle_created_at &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWB).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		''
																	) : Object.entries(dictBundlesRB).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		''
																	) : (
																		''
																	)}
																</div>

																<div className='text-right font-semibold'>
																	{Object.entries(dictBundlesAC).filter(
																		([key, value]) =>
																			parseInt(value[0].student_id) ===
																			parseInt(id)
																	).length !== 0
																		? 'Student Complete Date:'
																		: Object.entries(dictBundlesWA).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? 'Student Complete Date:'
																		: Object.entries(dictBundlesWC).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? ''
																		: Object.entries(dictBundlesWB).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? ''
																		: Object.entries(dictBundlesRB).filter(
																				([key, value]) =>
																					parseInt(value[0].student_id) ===
																					parseInt(id)
																		  ).length !== 0
																		? ''
																		: ''}
																</div>
																<div className='col-span-6'>
																	{Object.entries(dictBundlesAC).filter(
																		([key, value]) =>
																			parseInt(value[0].student_id) ===
																			parseInt(id)
																	).length !== 0 ? (
																		<div>
																			{dateHolder?.student_complete_date &&
																				new Date(
																					dateHolder?.student_complete_date
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.student_complete_date &&
																				', '}
																			{dateHolder?.student_complete_date &&
																				new Date(
																					dateHolder?.student_complete_date
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.student_complete_date &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWA).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		<div>
																			{dateHolder?.complete_date &&
																				new Date(
																					dateHolder?.complete_date
																				).toLocaleTimeString('en-US', {
																					timeZone: 'UTC',
																				})}
																			{dateHolder?.complete_date && ', '}
																			{dateHolder?.complete_date &&
																				new Date(
																					dateHolder?.complete_date
																				).toLocaleDateString('en-US', {
																					year: 'numeric',
																					month: 'long',
																					day: 'numeric',
																					timeZone: 'UTC',
																				})}
																			{!dateHolder?.complete_date &&
																				'Date not found'}
																		</div>
																	) : Object.entries(dictBundlesWC).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		''
																	) : Object.entries(dictBundlesWB).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		''
																	) : Object.entries(dictBundlesRB).filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(id)
																	  ).length !== 0 ? (
																		''
																	) : (
																		''
																	)}
																</div>

																<div className='text-right font-semibold'>
																	{Object.entries(dictBundlesAC)
																		.filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(selectedDetail)
																		)
																		.map(([key, value], idx) => value)
																		.length !== 0 && 'Certificates Accept:'}
																</div>
																<div className='col-span-6'>
																	{Object.entries(dictBundlesAC)
																		.filter(
																			([key, value]) =>
																				parseInt(value[0].student_id) ===
																				parseInt(selectedDetail)
																		)
																		.map(([key, value], idx) => value)
																		.length !== 0 && (
																		<>
																			<div>
																				Certificates approved by{' '}
																				<span className='font-semibold'>
																					{
																						Object.entries(dictBundlesAC)
																							.filter(
																								([key, value]) =>
																									parseInt(
																										value[0].student_id
																									) === parseInt(selectedDetail)
																							)
																							.map(
																								([key, value], idx) => value
																							)[0][0]?.certificate_coordinator
																					}{' '}
																				</span>{' '}
																				at{' '}
																				{Object.entries(dictBundlesAC)
																					.filter(
																						([key, value]) =>
																							parseInt(value[0].student_id) ===
																							parseInt(selectedDetail)
																					)
																					.map(
																						([key, value], idx) => value
																					)[0][0]?.pass_date &&
																					new Date(
																						Object.entries(dictBundlesAC)
																							.filter(
																								([key, value]) =>
																									parseInt(
																										value[0].student_id
																									) === parseInt(selectedDetail)
																							)
																							.map(
																								([key, value], idx) => value
																							)[0][0]?.pass_date
																					).toLocaleTimeString('en-US', {
																						timeZone: 'UTC',
																					})}
																				{', '}
																				{Object.entries(dictBundlesAC)
																					.filter(
																						([key, value]) =>
																							parseInt(value[0].student_id) ===
																							parseInt(selectedDetail)
																					)
																					.map(
																						([key, value], idx) => value
																					)[0][0]?.pass_date &&
																					new Date(
																						Object.entries(dictBundlesAC)
																							.filter(
																								([key, value]) =>
																									parseInt(
																										value[0].student_id
																									) === parseInt(selectedDetail)
																							)
																							.map(
																								([key, value], idx) => value
																							)[0][0]?.pass_date
																					).toLocaleDateString('en-US', {
																						year: 'numeric',
																						month: 'long',
																						day: 'numeric',
																						timeZone: 'UTC',
																					})}
																			</div>
																		</>
																	)}
																</div>
															</div>

															{Object.entries(dictBundlesAC).filter(
																([key, value]) =>
																	parseInt(value[0].student_id) ===
																	parseInt(selectedDetail)
															).length !== 0 && (
																<div className='p-2 my-4'>
																	<div className='mb-2 text-xl font-semibold drop-shadow-md'>
																		Accepted Certificate Submission
																	</div>
																	<KTable>
																		<KTableHead
																			tableHeaders={[
																				{
																					name: 'MOOCs & Certificates',
																					alignment: 'center',
																					className: 'rounded-tl-md',
																				},
																				{
																					name: 'Bundle Feedback',
																					alignment: 'center',
																					className: '',
																				},
																				{
																					name: 'Completion Date',
																					alignment: 'center',
																					className: 'rounded-tr-md',
																				},
																			]}
																		/>
																		<KTableBody>
																			{Object.entries(dictBundlesAC)
																				.filter(
																					([key, value]) =>
																						parseInt(value[0].student_id) ===
																						parseInt(selectedDetail)
																				)
																				.map(([key, value], idx) => (
																					<tr
																						key={idx}
																						className={
																							idx % 2 === 0
																								? 'bg-zinc-100'
																								: 'bg-zinc-200/[0.75]'
																						}
																					>
																						<td className='px-4 py-4 text-lg font-medium '>
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
																										className='mt-2 py-1 w-full grid grid-cols-4 '
																									>
																										<NextLink
																											href={mooc_url ?? ''}
																											target='_blank'
																											className='col-span-3'
																										>
																											<span className='select-none text-black no-underline'>
																												-&gt;
																											</span>{' '}
																											<span className='text-blue-600 hover:underline underline-offset-2'>
																												{mooc_name}
																											</span>
																										</NextLink>

																										{!!certificate_url && (
																											<NextLink
																												href={
																													certificate_url ?? ''
																												}
																												target='_blank'
																												className='font-semibold text-indigo-700/[0.8] hover:underline underline-offset-2 '
																											>
																												Certificate
																											</NextLink>
																										)}
																									</div>
																								)
																							)}
																						</td>
																						<td className='max-w-xs px-4 py-4 text-lg font-medium  '>
																							<div className=' max-w-max mt-2 px-2 text-justify text-neutral-700 '>
																								{value[0]?.comment}
																								{console.log(value)}
																							</div>
																						</td>
																						<td className='px-4 py-4 text-lg font-medium text-center '>
																							<div>
																								Certificates approved by{' '}
																								<span className='font-semibold'>
																									{
																										value[0]
																											?.certificate_coordinator
																									}{' '}
																								</span>{' '}
																							</div>
																							<div>
																								at{' '}
																								{value[0]?.pass_date &&
																									new Date(
																										value[0]?.pass_date
																									).toLocaleDateString(
																										'en-US',
																										{
																											weekday: 'long',
																											year: 'numeric',
																											month: 'long',
																											day: 'numeric',
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							<div>
																								{value[0]?.pass_date &&
																									new Date(
																										value[0]?.pass_date
																									).toLocaleTimeString(
																										'en-US',
																										{
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							{!value[0]?.pass_date &&
																								'Date not found'}
																						</td>
																					</tr>
																				))}
																		</KTableBody>
																	</KTable>
																</div>
															)}

															{Object.entries(dictBundlesWA).filter(
																([key, value]) =>
																	parseInt(value[0].student_id) ===
																	parseInt(selectedDetail)
															).length !== 0 && (
																<div className='p-2 my-4'>
																	<div className='mb-2 text-xl font-semibold drop-shadow-md'>
																		Waiting Approval for Certificate Submissions
																	</div>
																	<KTable>
																		<KTableHead
																			tableHeaders={[
																				{
																					name: 'MOOCs & Certificates',
																					alignment: 'center',
																					className: 'rounded-tl-md',
																				},
																				{
																					name: 'Bundle Feedback',
																					alignment: 'center',
																					className: '',
																				},
																				{
																					name: 'Completion Dates',
																					alignment: 'center',
																					className: 'rounded-tr-md',
																				},
																			]}
																		/>
																		<KTableBody>
																			{Object.entries(dictBundlesWA)
																				.filter(
																					([key, value]) =>
																						parseInt(value[0].student_id) ===
																						parseInt(selectedDetail)
																				)
																				.map(([key, value], idx) => (
																					<tr
																						key={idx}
																						className={
																							idx % 2 === 0
																								? 'bg-zinc-100'
																								: 'bg-zinc-200/[0.75]'
																						}
																					>
																						<td className='px-4 py-4 text-lg font-medium '>
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
																										className='mt-2 py-1 w-full grid grid-cols-4 '
																									>
																										<NextLink
																											href={mooc_url ?? ''}
																											target='_blank'
																											className='col-span-3'
																										>
																											<span className='select-none text-black no-underline'>
																												-&gt;
																											</span>{' '}
																											<span className='text-blue-600 hover:underline underline-offset-2'>
																												{mooc_name}
																											</span>
																										</NextLink>

																										{!!certificate_url && (
																											<NextLink
																												href={
																													certificate_url ?? ''
																												}
																												target='_blank'
																												className='font-semibold text-indigo-700/[0.8] hover:underline underline-offset-2 '
																											>
																												Certificate
																											</NextLink>
																										)}
																									</div>
																								)
																							)}
																						</td>
																						<td className='max-w-xs px-4 py-4 text-lg font-medium  '>
																							<div className=' max-w-max mt-2 px-2 text-justify text-neutral-700 '>
																								{value[0]?.comment}
																							</div>
																						</td>
																						<td className='px-4 py-4 text-lg font-medium text-center '>
																							{!!value[0].complete_date && (
																								<div className='mb-2'>
																									<div>
																										Bundle completed by student
																									</div>
																									<div>
																										<div>
																											{value[0]
																												?.complete_date && (
																												<span>at </span>
																											)}

																											{value[0]
																												?.complete_date &&
																												new Date(
																													value[0]?.complete_date
																												).toLocaleDateString(
																													'en-US',
																													{
																														weekday: 'long',
																														year: 'numeric',
																														month: 'long',
																														day: 'numeric',
																														timeZone: 'UTC',
																													}
																												)}
																										</div>
																										<div>
																											{value[0]
																												?.complete_date &&
																												new Date(
																													value[0]?.complete_date
																												).toLocaleTimeString(
																													'en-US',
																													{
																														timeZone: 'UTC',
																													}
																												)}
																										</div>
																									</div>
																								</div>
																							)}

																							<div>
																								Bundle approved by{' '}
																								<span className='font-semibold'>
																									{value[0]?.bundle_coordinator}{' '}
																								</span>{' '}
																							</div>
																							<div>
																								{value[0]?.bundle_date && (
																									<span>at </span>
																								)}

																								{value[0]?.bundle_date &&
																									new Date(
																										value[0]?.bundle_date
																									).toLocaleDateString(
																										'en-US',
																										{
																											weekday: 'long',
																											year: 'numeric',
																											month: 'long',
																											day: 'numeric',
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							<div>
																								{value[0]?.bundle_date &&
																									new Date(
																										value[0]?.bundle_date
																									).toLocaleTimeString(
																										'en-US',
																										{
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							{!value[0]?.bundle_date &&
																								'Date not found'}
																						</td>
																					</tr>
																				))}
																		</KTableBody>
																	</KTable>
																</div>
															)}

															{Object.entries(dictBundlesWC).filter(
																([key, value]) =>
																	parseInt(value[0].student_id) ===
																	parseInt(selectedDetail)
															).length !== 0 && (
																<div className='p-2 my-4'>
																	<div className='mb-2 text-xl font-semibold drop-shadow-md'>
																		Waiting for Student to Upload Certificates
																	</div>
																	<KTable>
																		<KTableHead
																			tableHeaders={[
																				{
																					name: 'MOOCs & Certificates',
																					alignment: 'center',
																					className: 'rounded-tl-md',
																				},
																				{
																					name: 'Completion Date',
																					alignment: 'center',
																					className: 'rounded-tr-md',
																				},
																			]}
																		/>
																		<KTableBody>
																			{Object.entries(dictBundlesWC)
																				.filter(
																					([key, value]) =>
																						parseInt(value[0].student_id) ===
																						parseInt(selectedDetail)
																				)
																				.map(([key, value], idx) => (
																					<tr
																						key={idx}
																						className={
																							idx % 2 === 0
																								? 'bg-zinc-100'
																								: 'bg-zinc-200/[0.75]'
																						}
																					>
																						<td className='px-4 py-4 text-lg font-medium '>
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
																										className='mt-2 py-1 w-full grid grid-cols-4 '
																									>
																										<NextLink
																											href={mooc_url ?? ''}
																											target='_blank'
																											className='col-span-3'
																										>
																											<span className='select-none text-black no-underline'>
																												-&gt;
																											</span>{' '}
																											<span className='text-blue-600 hover:underline underline-offset-2'>
																												{mooc_name}
																											</span>
																										</NextLink>

																										{!!certificate_url ? (
																											<NextLink
																												href={
																													certificate_url ?? ''
																												}
																												target='_blank'
																												className='font-semibold text-indigo-700/[0.8] hover:underline underline-offset-2 '
																											>
																												Certificate
																											</NextLink>
																										) : (
																											<span className='text-neutral-600'>
																												No certificate was
																												found...
																											</span>
																										)}
																									</div>
																								)
																							)}
																						</td>
																						<td className='px-4 py-4 text-lg font-medium text-center '>
																							<div>
																								Bundle approved by{' '}
																								<span className='font-semibold'>
																									{value[0]?.coordinator_name}{' '}
																								</span>{' '}
																							</div>
																							<div>
																								at{' '}
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleDateString(
																										'en-US',
																										{
																											weekday: 'long',
																											year: 'numeric',
																											month: 'long',
																											day: 'numeric',
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							<div>
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleTimeString(
																										'en-US',
																										{
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							{!value[0]?.bundle_created_at &&
																								'Date not found'}
																						</td>
																					</tr>
																				))}
																		</KTableBody>
																	</KTable>
																</div>
															)}

															{Object.entries(dictBundlesWB).filter(
																([key, value]) =>
																	parseInt(value[0].student_id) ===
																	parseInt(selectedDetail)
															).length !== 0 && (
																<div className='p-2 my-4'>
																	<div className='mb-2 text-xl font-semibold drop-shadow-md'>
																		Waiting Approval for Bundle Submissions
																	</div>
																	<KTable>
																		<KTableHead
																			tableHeaders={[
																				{
																					name: 'MOOCs',
																					alignment: 'center',
																					className: 'rounded-tl-md',
																				},
																				{
																					name: 'Completion Date',
																					alignment: 'center',
																					className: 'rounded-tr-md',
																				},
																			]}
																		/>
																		<KTableBody>
																			{Object.entries(dictBundlesWB)
																				.filter(
																					([key, value]) =>
																						parseInt(value[0].student_id) ===
																						parseInt(selectedDetail)
																				)
																				.map(([key, value], idx) => (
																					<tr
																						key={idx}
																						className={
																							idx % 2 === 0
																								? 'bg-zinc-100'
																								: 'bg-zinc-200/[0.75]'
																						}
																					>
																						<td className='px-4 py-4 text-lg font-medium '>
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
																										className='mt-2 py-1 w-full grid grid-cols-4 '
																									>
																										<NextLink
																											href={mooc_url ?? ''}
																											target='_blank'
																											className='col-span-3'
																										>
																											<span className='select-none text-black no-underline'>
																												-&gt;
																											</span>{' '}
																											<span className='text-blue-600 hover:underline underline-offset-2'>
																												{mooc_name}
																											</span>
																										</NextLink>
																									</div>
																								)
																							)}
																						</td>
																						<td className='px-4 py-4 text-lg font-medium text-center '>
																							<div>Bundle created at </div>
																							<div>
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleDateString(
																										'en-US',
																										{
																											weekday: 'long',
																											year: 'numeric',
																											month: 'long',
																											day: 'numeric',
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							<div>
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleTimeString(
																										'en-US',
																										{
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							{!value[0]?.bundle_created_at &&
																								'Date not found'}
																						</td>
																					</tr>
																				))}
																		</KTableBody>
																	</KTable>
																</div>
															)}

															{Object.entries(dictBundlesRC).filter(
																([key, value]) =>
																	parseInt(value[0].student_id) ===
																	parseInt(selectedDetail)
															).length !== 0 && (
																<div className='p-2 my-4'>
																	<div className='mb-2 text-xl font-semibold drop-shadow-md'>
																		Rejected Certificate Submissions
																	</div>
																	<KTable>
																		<KTableHead
																			tableHeaders={[
																				{
																					name: 'MOOCs & Certificates',
																					alignment: 'center',
																					className: 'rounded-tl-md',
																				},
																				{
																					name: 'Bundle Feedback',
																					alignment: 'center',
																					className: '',
																				},
																				{
																					name: 'Rejection Reason',
																					alignment: 'center',
																					className: '',
																				},
																				{
																					name: 'Rejection Date',
																					alignment: 'center',
																					className: 'rounded-tr-md',
																				},
																			]}
																		/>
																		<KTableBody>
																			{Object.entries(dictBundlesRC)
																				.filter(
																					([key, value]) =>
																						parseInt(value[0].student_id) ===
																						parseInt(selectedDetail)
																				)
																				.map(([key, value], idx) => (
																					<tr
																						key={idx}
																						className={
																							idx % 2 === 0
																								? 'bg-zinc-100'
																								: 'bg-zinc-200/[0.75]'
																						}
																					>
																						<td className='px-4 py-4 text-lg font-medium '>
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
																										className='mt-2 py-1 w-full grid grid-cols-4 '
																									>
																										<NextLink
																											href={mooc_url ?? ''}
																											target='_blank'
																											className='col-span-3'
																										>
																											<span className='select-none text-black no-underline'>
																												-&gt;
																											</span>{' '}
																											<span className='text-blue-600 hover:underline underline-offset-2'>
																												{mooc_name}
																											</span>
																										</NextLink>

																										{!!certificate_url && (
																											<NextLink
																												href={
																													certificate_url ?? ''
																												}
																												target='_blank'
																												className='font-semibold text-indigo-700/[0.8] hover:underline underline-offset-2 '
																											>
																												Certificate
																											</NextLink>
																										)}
																									</div>
																								)
																							)}
																						</td>
																						<td className='max-w-xs px-4 py-4 text-lg font-medium  '>
																							<div className=' max-w-max mt-2 px-2 text-justify text-neutral-700 '>
																								{value[0]?.comment ??
																									'No feedback was found...'}
																							</div>
																						</td>
																						<td className='max-w-xs px-4 py-4 text-lg font-medium  '>
																							<div className=' max-w-max mt-2 px-2 text-justify text-neutral-700 '>
																								{value[0]
																									?.reject_status_comment ??
																									'No reject reason was found...'}
																							</div>
																						</td>
																						<td className='px-4 py-4 text-lg font-medium text-center '>
																							<div>
																								Certificates rejected by{' '}
																								<span className='font-semibold'>
																									{value[0]?.coordinator_name}{' '}
																								</span>{' '}
																							</div>
																							<div>
																								at{' '}
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleDateString(
																										'en-US',
																										{
																											weekday: 'long',
																											year: 'numeric',
																											month: 'long',
																											day: 'numeric',
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							<div>
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleTimeString(
																										'en-US',
																										{
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							{!value[0]?.bundle_created_at &&
																								'Date not found'}
																						</td>
																					</tr>
																				))}
																		</KTableBody>
																	</KTable>
																</div>
															)}

															{Object.entries(dictBundlesRB).filter(
																([key, value]) =>
																	parseInt(value[0].student_id) ===
																	parseInt(selectedDetail)
															).length !== 0 && (
																<div className='p-2 my-4'>
																	<div className='mb-2 text-xl font-semibold drop-shadow-md'>
																		Rejected Bundle Submissions
																	</div>
																	<KTable>
																		<KTableHead
																			tableHeaders={[
																				{
																					name: 'MOOCs',
																					alignment: 'center',
																					className: 'rounded-tl-md',
																				},
																				{
																					name: 'Rejection Reason',
																					alignment: 'center',
																					className: '',
																				},
																				{
																					name: 'Rejection Date',
																					alignment: 'center',
																					className: 'rounded-tr-md',
																				},
																			]}
																		/>
																		<KTableBody>
																			{Object.entries(dictBundlesRB)
																				.filter(
																					([key, value]) =>
																						parseInt(value[0].student_id) ===
																						parseInt(selectedDetail)
																				)
																				.map(([key, value], idx) => (
																					<tr
																						key={idx}
																						className={
																							idx % 2 === 0
																								? 'bg-zinc-100'
																								: 'bg-zinc-200/[0.75]'
																						}
																					>
																						<td className='px-4 py-4 text-lg font-medium '>
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
																										className='mt-2 py-1 w-full grid grid-cols-4 '
																									>
																										<NextLink
																											href={mooc_url ?? ''}
																											target='_blank'
																											className='col-span-3'
																										>
																											<span className='select-none text-black no-underline'>
																												-&gt;
																											</span>{' '}
																											<span className='text-blue-600 hover:underline underline-offset-2'>
																												{mooc_name}
																											</span>
																										</NextLink>
																									</div>
																								)
																							)}
																						</td>
																						<td className='max-w-xs px-4 py-4 text-lg font-medium  '>
																							<div className=' max-w-max mt-2 px-2 text-justify text-neutral-700 '>
																								{value[0]
																									?.reject_status_comment ??
																									'No reject reason was found...'}
																							</div>
																						</td>
																						<td className='px-4 py-4 text-lg font-medium text-center '>
																							<div>
																								Bundle rejected by{' '}
																								<span className='font-semibold'>
																									{value[0]?.coordinator_name}{' '}
																								</span>{' '}
																							</div>
																							<div>
																								at{' '}
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleDateString(
																										'en-US',
																										{
																											weekday: 'long',
																											year: 'numeric',
																											month: 'long',
																											day: 'numeric',
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							<div>
																								{value[0]?.bundle_created_at &&
																									new Date(
																										value[0]?.bundle_created_at
																									).toLocaleTimeString(
																										'en-US',
																										{
																											timeZone: 'UTC',
																										}
																									)}
																							</div>
																							{!value[0]?.bundle_created_at &&
																								'Date not found'}
																						</td>
																					</tr>
																				))}
																		</KTableBody>
																	</KTable>
																</div>
															)}
														</section>
													)}
												</td>
											</tr>
										</>
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

			{selectedTabs === 1 && (
				<div className='w-[95%]'>
					<div>
						{/* Print to Excel */}
						<div className='mb-6 flex justify-center items-center'>
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

					<KTable className=''>
						<KTableHead
							tableHeaders={[
								{
									name: 'Student',
									alignment: 'left',
									className: 'rounded-tl-md',
								},
								{
									name: 'MOOCs & Certificates',
									alignment: 'center',
									className: '',
								},
								{
									name: 'Bundle Feedback of Student',
									alignment: 'center',
									className: 'max-w-xs',
								},
								{
									name: 'Completion Date',
									alignment: 'center',
								},
								{
									name: 'Edit Bundle',
									alignment: 'center',
									className: 'rounded-tr-md',
								},
							]}
						></KTableHead>
						<KTableBody>
							{Object.entries(dictBundlesAC).map(([key, value], idx) => (
								<tr
									key={idx}
									className={
										idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
									}
								>
									<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
										<div className='flex flex-col justify-start items-start'>
											<span className='font-normal'>
												{value[0]?.student_name} {value[0]?.student_surname}
											</span>
											<span className='font-semibold'>
												{value[0]?.student_no}
											</span>
										</div>
									</td>
									<td className='px-4 py-4 text-lg font-medium '>
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
													className='mt-2 py-1 w-full grid grid-cols-4 '
												>
													<NextLink
														href={mooc_url ?? ''}
														target='_blank'
														className='col-span-3'
													>
														<span className='select-none text-black no-underline'>
															-&gt;
														</span>{' '}
														<span className='text-blue-600 hover:underline underline-offset-2'>
															{mooc_name}
														</span>
													</NextLink>

													{!!certificate_url && (
														<NextLink
															href={certificate_url ?? ''}
															target='_blank'
															className='font-semibold text-indigo-700/[0.8] hover:underline underline-offset-2 '
														>
															Certificate
														</NextLink>
													)}
												</div>
											)
										)}
									</td>
									<td className='max-w-xs px-4 py-4 text-lg font-medium  '>
										<div className=' max-w-max mt-2 px-2 text-justify text-neutral-700 '>
											{value[0]?.comment}
											{console.log(value)}
										</div>
									</td>
									<td className='px-4 py-4 text-lg font-medium text-center '>
										{value[0]?.pass_date &&
											new Date(value[0]?.pass_date).toLocaleDateString(
												'en-US',
												{
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													timeZone: 'UTC',
												}
											)}
										<div>
											{value[0]?.pass_date &&
												new Date(value[0]?.pass_date).toLocaleTimeString(
													'en-US',
													{
														timeZone: 'UTC',
													}
												)}
										</div>
										{!value[0]?.pass_date && 'Date not found'}
									</td>

									<td className=' text-center  px-4 py-4 text-lg font-medium whitespace-nowrap '>
										{!!is_active && (
											<button
												onClick={() => {
													setSelected(key);
													getBundleDetails(key);
												}}
												className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
											>
												<PencilSquareIcon className='h-7 w-7 text-zin-700 ' />
											</button>
										)}
									</td>
								</tr>
							))}
							{Object.keys(dictBundlesAC)?.length === 0 && (
								<EmptyTableMessage cols={6} message='Nothing was found...' />
							)}
						</KTableBody>
					</KTable>
				</div>
			)}

			<Modal
				{...{
					isOpen,
					setIsOpen,
					closeModal,
					openModal,
				}}
				title='Edit selected bundle'
				extraLarge={true}
			>
				<div className={`transition-all mt-2 `}>
					<div className='flex flex-col items-center justify-center'>
						<div className='w-full text-lg flex justify-evenly items-center gap-1 my-2'>
							<span>
								<span className='font-semibold'>Name:</span>{' '}
								{selectedBundle[0]?.student_name}{' '}
								{selectedBundle[0]?.student_surname}
							</span>
							<span>
								<span className='font-semibold'>Student No: </span>
								{selectedBundle[0]?.student_no}
							</span>
							<span>
								<span className='font-semibold'>Email: </span>
								{selectedBundle[0]?.student_email}
							</span>
						</div>
					</div>

					{selectedModalTab === 0 && (
						<div className='mt-2 w-full overflow-x-auto'>
							<KTable>
								<KTableHead
									tableHeaders={
										selectedTabs === 0
											? [
													{
														name: 'MOOC',
														alignment: 'left',
														className: 'rounded-tl-md rounded-tr-md',
													},
											  ]
											: [
													{
														name: 'MOOC',
														alignment: 'left',
														className: 'rounded-tl-md',
													},
													{ name: 'Certificate', alignment: 'left' },
													{
														name: 'Change Certificate URL',
														alignment: 'center',
														className: 'rounded-tr-md',
													},
											  ]
									}
								></KTableHead>
								<KTableBody>
									{selectedBundle.map((bundle, idx) => (
										<tr
											key={idx}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className='px-4 py-2'>
												<MdDeleteForever
													size={24}
													onClick={() =>
														handleDeleteMooc(bundle.bundle_detail_id)
													}
													className=' drop-shadow-md align-bottom text-red-700 cursor-pointer mr-2'
												/>
												{bundle.mooc_name}
											</td>
											{selectedTabs !== 0 && (
												<>
													<td className='px-4 py-2'>
														{bundle?.certificate_url && (
															<NextLink
																href={bundle.certificate_url}
																target='_blank'
																className='text-blue-500'
															>
																{bundle.certificate_url}
															</NextLink>
														)}
													</td>
													<td className='px-4 py-2'>
														<div className='flex justify-center'>
															<button
																onClick={() =>
																	handleEditCertificate(bundle.bundle_detail_id)
																}
																className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
															>
																<PencilSquareIcon className='h-7 w-7 text-zinc-700' />
															</button>
														</div>
													</td>
												</>
											)}
										</tr>
									))}
								</KTableBody>
							</KTable>
						</div>
					)}

					{selectedModalTab === 0 && (
						<Formik
							initialValues={editBundleMoocAddModel.initials}
							validationSchema={editBundleMoocAddModel.schema}
							onSubmit={handleAddMooc}
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
									className={`grid grid-cols-1 md:grid-cols-4 gap-2 content-center place-content-center px-4 mb-8`}
								>
									<label className={classLabel} htmlFor='addmooc'>
										Add a MOOC
									</label>
									<div
										name='addmooc'
										id='addmooc'
										className='col-span-3 flex flex-col justify-center overflow-visible'
									>
										<Multiselect
											className='w-full '
											options={moocs} // Options to display in the dropdown
											selectedValues={selectedMooc} // Preselected value to persist in dropdown
											onSelect={handleSelect} // Function will trigger on select event
											onRemove={handleRemove} // Function will trigger on remove event
											displayValue='name' // Property name to display in the dropdown options
											placeholder='Select a MOOC'
											style={{
												chips: {
													padding: '0.5rem 1rem',
													background: '#212021',
													borderRadius: '4rem',
													color: '#f2f2f2',
													fontSize: '1rem',
												},
												multiselectContainer: {
													color: '#212021',
													fontSize: '1rem',
												},
												searchBox: {
													padding: '0.5rem',
													color: '#f2f2f2',
													border: '1px solid #212021',
													borderBottom: '1px solid #212021',
													borderRadius: '5px',
													fontSize: '1rem',
												},
												inputField: {
													fontSize: '1rem',
												},
												option: {
													border: 'none',
													borderBottom: '1px solid #ccc',
													borderRadius: '0',
												},
											}}
										/>
									</div>

									<button
										variant='contained'
										color='primary'
										size='large'
										type='submit'
										className={`mx-auto my-4 col-span-1 tracking-wider text-center text-xl py-1 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-xl border-none cursor-pointer transition-colors`}
										disabled={isSubmitting}
									>
										<div
											className={`inline-block rounded-sm bg-purple-500 ${
												isSubmitting && 'w-4 h-4 mr-2 animate-spin'
											}`}
										></div>
										<span>{isSubmitting ? 'ADDING...' : 'ADD MOOC'}</span>
									</button>
								</form>
							)}
						</Formik>
					)}

					{selectedModalTab === 0 && (
						<Formik
							initialValues={{ comment: selectedBundle[0].comment }}
							validationSchema={editBundleFeedbackModel.schema}
							onSubmit={handleCommentChange}
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
									<label className={classLabel} htmlFor='comment'>
										Bundle Feedback
									</label>
									<textarea
										className={classInput}
										type='text'
										name='comment'
										id='comment'
										style={{ resize: 'vertical' }}
										value={values.comment}
										onChange={handleChange}
									/>
									<span className={classError}>
										{errors.comment && touched.comment && errors.comment}
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
										<span>{isSubmitting ? 'Editing...' : 'EDIT FEEDBACK'}</span>
									</button>
								</form>
							)}
						</Formik>
					)}
				</div>
			</Modal>
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
		const backendURLwb = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-bundles`;
		const backendURLwa = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-approval`;

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

		const { data: dataWB } = await axios.get(backendURLwb, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataWA } = await axios.get(backendURLwa, {
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

		const backendURLco = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/info`;

		const { data: dataCo } = await axios.get(backendURLco, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { course } = dataCo;

		const backendURLst = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/students`;
		const backendURLen = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-students`;

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

		const { students } = dataST;
		const { students: waiting_students_raw } = dataEN;

		const waiting_students = groupBy(waiting_students_raw, (student) => {
			return student.student_id;
		});

		const { bundles: bundlesRB } = dataRB;
		const { bundles: bundlesWC } = dataWC;
		const { bundles: bundlesRC } = dataRC;
		const { bundles: bundlesAC, is_active } = dataAC;

		const { bundles: bundlesWB } = dataWB;
		const { bundles: bundlesWA } = dataWA;

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
		const dictBundlesWB = groupBy(bundlesWB, (bundle) => {
			return bundle.bundle_id;
		});
		const dictBundlesWA = groupBy(bundlesWA, (bundle) => {
			return bundle.bundle_id;
		});

		const backendURLmo = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/moocs`;

		const { data: dataMo } = await axios.get(backendURLmo, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const { moocs } = dataMo;

		return {
			props: {
				bundlesRB,
				bundlesWC,
				bundlesRC,
				bundlesAC,
				bundlesWB,
				bundlesWA,
				is_active,
				dictBundlesRB,
				dictBundlesWC,
				dictBundlesRC,
				dictBundlesAC,
				dictBundlesWB,
				dictBundlesWA,
				currentCourse,
				course,
				students,
				waiting_students,
				moocs,
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
				bundlesWB: [],
				bundlesWA: [],
				dictBundlesWB: {},
				dictBundlesWA: {},
				is_active: true,
				dictBundlesRB: {},
				dictBundlesWC: {},
				dictBundlesRC: {},
				dictBundlesAC: {},
				currentCourse: {},
				course: {},
				students: [],
				waiting_students: [],
				moocs: [],
			},
		};
	}
}
