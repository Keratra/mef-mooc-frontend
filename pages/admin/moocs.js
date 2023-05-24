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
	XCircleIcon,
	XMarkIcon,
	CheckIcon,
} from '@heroicons/react/24/solid';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import { notify } from 'utils/notify';
import { FiUpload, FiDelete, FiX, FiSettings } from 'react-icons/fi';
import ExcelJS from 'exceljs';

export default function AdminMOOCsPage({ moocs }) {
	const Router = useRouter();
	const [selected, setSelected] = useState({
		id: 0,
		name: '',
		url: '',
		average_hours: '',
	});

	const [file, setFile] = useState(null);
	const [showSettings, setShowSettings] = useState(false);
	const [settings, setSettings] = useState({
		rowHeader: 1,
		colMoocName: 'Course Name',
		colMoocUrl: 'Course URL',
		colMoocAverageHours: 'Average Hours',
	});
	const [uploadedMoocs, setUploadedMoocs] = useState([]);

	const [isOpenImport, setIsOpenImport] = useState(false);
	const [isOpenAdd, setIsOpenAdd] = useState(false);
	const [isOpenEdit, setIsOpenEdit] = useState(false);

	function closeModalImport() {
		setIsOpenImport(false);
		setFile(null);
		setUploadedMoocs([]);
	}
	function openModalImport() {
		setIsOpenImport(true);
	}

	function closeModalAdd() {
		setIsOpenAdd(false);
	}
	function openModalAdd() {
		setIsOpenAdd(true);
	}

	function closeModalEdit() {
		setIsOpenEdit(false);
	}
	function openModalEdit() {
		setIsOpenEdit(true);
	}

	const handleEdit = async (
		{ id, name, url, average_hours },
		{ setSubmitting }
	) => {
		try {
			if (id <= 0) throw 'Please select a MOOC';

			await axios.post(`/api/admin/edit-mooc`, {
				id,
				name,
				url,
				average_hours,
			});

			Router.reload();
		} catch (error) {
			console.log(error);
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		} finally {
			setSubmitting(false);
			closeModalEdit();
		}
	};

	const handleAdd = async ({ name, url, average_hours }, { setSubmitting }) => {
		try {
			await axios.post(`/api/admin/add-mooc`, {
				name,
				url,
				average_hours,
			});

			Router.reload();
		} catch (error) {
			console.log(error);
			notify(
				'error',
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		} finally {
			setSubmitting(false);
			closeModalAdd();
		}
	};

	const handleChangeStatus = async (mooc_id) => {
		try {
			await axios.post(`/api/admin/change-mooc-status`, {
				mooc_id,
			});

			Router.reload();
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

	const handleFileChange = async (event) => {
		setFile(event.target.files[0]);

		if (event.target.files[0]) {
			try {
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(event.target.files[0]);

				const worksheet = workbook.getWorksheet(1);
				let data = [];

				worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
					const rowData = [];
					row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
						rowData.push(cell.value);
					});
					data.push(rowData);
				});

				const colMoocName = data[settings?.rowHeader - 1 ?? 0].findIndex(
					(col) => col?.toLowerCase() === settings?.colMoocName?.toLowerCase()
				);
				const colMoocUrl = data[settings?.rowHeader - 1 ?? 0].findIndex(
					(col) => col?.toLowerCase() === settings?.colMoocUrl?.toLowerCase()
				);
				const colMoocAverageHours = data[
					settings?.rowHeader - 1 ?? 0
				].findIndex(
					(col) =>
						col?.toLowerCase() === settings?.colMoocAverageHours?.toLowerCase()
				);

				// notify('info', data[settings?.rowHeader - 1 ?? 0][colMoocName]);
				// notify('info', data[settings?.rowHeader - 1 ?? 0][colMoocUrl]);
				// notify('info', data[settings?.rowHeader - 1 ?? 0][colMoocAverageHours]);

				data = data.map((row) => [
					row[colMoocName],
					row[colMoocUrl],
					row[colMoocAverageHours],
				]);

				data = data.filter(
					([name, url, average_hours]) => !!name && !!url && !!average_hours
				);

				setUploadedMoocs(data.slice(settings?.rowHeader ?? 1));

				// const maxColumns = worksheet.columnCount;
				// for (let col = 1; col <= maxColumns; col++) {
				// 	const columnData = [];
				// 	for (let row = 1; row <= worksheet.rowCount; row++) {
				// 		const cell = worksheet.getCell(row, col);
				// 		columnData.push(cell.value);
				// 	}
				// 	data.push(columnData);
				// }

				// console.log('Extracted data:', data);
			} catch (error) {
				console.error('Error reading Excel file:', error);
			}
		}
	};

	const handleRemove = async (moocIndex) => {
		try {
			if (uploadedMoocs?.length < moocIndex)
				throw Error('Please select a valid MOOC to remove');

			setUploadedMoocs(() =>
				uploadedMoocs.filter((_, index) => index !== moocIndex)
			);
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

	const handleAddMultipleMOOCs = async () => {
		try {
			if (!uploadedMoocs?.length) throw Error('Please upload MOOCs');

			await axios.post(`/api/admin/add-multiple-moocs`, {
				moocs: uploadedMoocs.map(([name, url, average_hours]) => {
					return { name, url, average_hours };
				}),
			});

			Router.reload();
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

	const classError = `
		md:col-span-2
		ml-2 rounded-lg
		text-base text-red-600
		drop-shadow-md
	`;

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>MOOCs</PageTitle>

			<div className='w-full max-w-7xl mx-auto'>
				<div className='flex justify-between items-center px-2 pt-2 pb-4 text-lg font-medium text-center '>
					<button
						onClick={() => openModalImport()}
						className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
					>
						IMPORT MOOCS
					</button>

					<button
						onClick={() => openModalAdd()}
						className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
					>
						CREATE MOOC
					</button>
				</div>

				<KTable>
					<KTableHead
						tableHeaders={[
							{
								name: 'MOOC Name',
								alignment: 'left',
								className: 'rounded-tl-md',
							},
							{ name: 'MOOC Link', alignment: 'left' },
							{ name: 'Average Hours', alignment: 'center' },
							{ name: 'Change Status', alignment: 'center' },
							{
								name: 'Edit a MOOC',
								alignment: 'center',
								className: 'rounded-tr-md',
							},
						]}
					></KTableHead>
					<KTableBody>
						{!!moocs &&
							moocs.map(({ id, name, url, average_hours, is_active }, idx) => (
								<tr
									key={id}
									className={
										idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
									}
								>
									<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
										{name}
									</td>

									<td className=' px-4 py-4 text-lg font-medium min-w-[15vw]'>
										<NextLink
											href={url}
											target='_blank'
											className='text-blue-600 hover:underline underline-offset-2'
										>
											<span>Click to open</span>
										</NextLink>
									</td>
									<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
										{average_hours}
									</td>
									<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
										<button
											onClick={() => handleChangeStatus(id)}
											className={` ${
												is_active
													? 'bg-rose-600 hover:bg-rose-400'
													: 'bg-emerald-600 hover:bg-emerald-400'
											} py-1 px-2 rounded-md shadow-lg text-center font-thin border-none cursor-pointer transition-colors`}
										>
											<span className='font-semibold text-lg tracking-wider text-white'>
												{is_active ? 'DISABLE' : 'ENABLE'}
											</span>
										</button>
									</td>
									<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
										<button
											onClick={() => {
												setSelected({
													id,
													name,
													url,
													average_hours,
												});
												openModalEdit();
											}}
											className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
										>
											<PencilSquareIcon className='h-7 w-7 text-zinc-700' />
										</button>
									</td>
								</tr>
							))}
						{moocs?.length === 0 && (
							<EmptyTableMessage cols={4} message='No MOOCs were found...' />
						)}
					</KTableBody>
				</KTable>
			</div>

			<Modal
				{...{
					isOpen: isOpenImport,
					setIsOpen: setIsOpenImport,
					closeModal: closeModalImport,
					openModal: openModalImport,
				}}
				title='Import MOOCs'
				extraLarge={true}
			>
				<div className={`transition-all mt-2 `}>
					<div
						className={`grid grid-cols-1 gap-2 content-center place-content-center px-4`}
					>
						<div className='col-span-full flex justify-between items-center'>
							<button
								onClick={() => setShowSettings((prev) => !prev)}
								className={` flex justify-center items-center gap-x-2 py-1 px-3 shadow-md text-center text-lg font-thin rounded-full text-zinc-800 hover:text-zinc-600 border-none cursor-pointer transition-colors `}
							>
								<FiSettings size={20} className='' />
								<span>
									{showSettings ? 'Hide Excel Settings' : 'Show Excel Settings'}
								</span>
							</button>

							<button
								onClick={() => setUploadedMoocs(() => [])}
								className={` flex justify-center items-center gap-x-2 py-1 px-3 shadow-md text-center text-lg font-thin rounded-full text-rose-800 hover:text-zinc-600 border-none cursor-pointer transition-colors bg-rose-200/[0.5]`}
							>
								<FiX size={20} className='' />
								<span>Delete All MOOCs</span>
							</button>
						</div>

						{showSettings && (
							<div className='col-span-full max-w-xl mx-auto grid grid-cols-2 gap-1'>
								<div className='grid grid-cols-1 gap-x-2 gap-y-3'>
									<label
										htmlFor='rowHeader'
										className={classLabel + ' text-base'}
									>
										Header Row Index
									</label>
									<input
										id='rowHeader'
										type='number'
										value={settings?.rowHeader}
										min={1}
										onChange={(e) =>
											setSettings(() => ({
												...settings,
												rowHeader: e.target.value,
											}))
										}
										className={classInput}
									/>
								</div>
								<div className='grid grid-cols-1 gap-x-2 gap-y-3'>
									<label
										htmlFor='colMoocName'
										className={classLabel + ' text-base'}
									>
										Course Name Column Name
									</label>
									<input
										id='colMoocName'
										type='text'
										value={settings?.colMoocName}
										onChange={(e) =>
											setSettings(() => ({
												...settings,
												colMoocName: e.target.value,
											}))
										}
										className={classInput}
									/>
								</div>
								<div className='grid grid-cols-1 gap-x-2 gap-y-3'>
									<label
										htmlFor='colMoocUrl'
										className={classLabel + ' text-base'}
									>
										Course URL Column Name
									</label>
									<input
										id='colMoocUrl'
										type='text'
										value={settings?.colMoocUrl}
										onChange={(e) =>
											setSettings(() => ({
												...settings,
												colMoocUrl: e.target.value,
											}))
										}
										className={classInput}
									/>
								</div>
								<div className='grid grid-cols-1 gap-x-2 gap-y-3'>
									<label
										htmlFor='colMoocAverageHours'
										className={classLabel + ' text-base'}
									>
										Average Hours Column Name
									</label>
									<input
										id='colMoocAverageHours'
										type='text'
										value={settings?.colMoocAverageHours}
										onChange={(e) =>
											setSettings(() => ({
												...settings,
												colMoocAverageHours: e.target.value,
											}))
										}
										className={classInput}
									/>
								</div>
							</div>
						)}

						<div className='w-full col-span-full flex justify-center items-center mt-4'>
							<input
								type='file'
								onChange={handleFileChange}
								className='
									block
									text-sm text-gray-500 
									file:mr-4 file:py-2 file:px-4 
									file:rounded-full file:border-0 
									file:cursor-pointer file:transition-colors
									file:text-sm file:font-semibold 
									file:bg-blue-50 file:text-blue-700 
									hover:file:bg-blue-100'
							/>
						</div>

						<div
							className='
								col-span-full
								max-h-[40rem] overflow-y-auto
								max-w-4xl
							'
						>
							{uploadedMoocs?.length > 0 && (
								<KTable className='my-2'>
									<KTableHead
										tableHeaders={[
											{
												name: 'MOOC Name',
												alignment: 'left',
												className: 'rounded-tl-md',
											},
											{ name: 'MOOC Link', alignment: 'center' },
											{
												name: 'Average Hours',
												alignment: 'center',
											},
											{
												name: 'Remove',
												alignment: 'center',
												className: 'rounded-tr-md',
											},
										]}
									/>
									<KTableBody>
										{!!uploadedMoocs &&
											uploadedMoocs.map(([a, b, c], idx) => (
												<tr
													key={idx}
													className={`
													
													${idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'}
												`}
												>
													<td className='px-4 py-4 text-lg font-medium break-all'>
														{a}
													</td>
													<td className='px-4 py-4 text-lg font-medium break-all'>
														<NextLink
															className='text-blue-700 hover:underline'
															href={b}
														>
															<span>Click to open</span>
														</NextLink>
													</td>
													<td className='px-4 py-4 text-lg font-medium break-all text-center'>
														{c}
													</td>
													<td className='px-4 py-4 text-lg font-medium text-center'>
														<button
															onClick={() => handleRemove(idx)}
															className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
														>
															<FiX className='h-7 w-7 text-rose-700 drop-shadow-md' />
														</button>
													</td>
												</tr>
											))}
									</KTableBody>
								</KTable>
							)}

							{uploadedMoocs?.length === 0 && (
								<div className='my-8 text-center'>
									<span className='text-zinc-700 font-semibold text-xl '>
										No MOOCs were uploaded...
									</span>
								</div>
							)}
						</div>

						{uploadedMoocs?.length > 0 && (
							<button
								variant='contained'
								color='primary'
								size='large'
								type='submit'
								className={`
								mx-auto  my-4 md:col-span-2 
								tracking-wider text-center text-xl 
								py-2 px-4 bg-[#212021] hover:bg-[#414041] 
								shadow-md text-white font-bold 
								rounded-xl border-none 
								cursor-pointer transition-colors`}
								onClick={() => handleAddMultipleMOOCs()}
							>
								{/* <div
								className={`inline-block rounded-sm bg-purple-500 ${
									isSubmitting && 'w-4 h-4 mr-2 animate-spin'
								}`}
							></div> */}
								<span>CREATE MOOCS</span>
							</button>
						)}
					</div>
				</div>
			</Modal>

			<Modal
				{...{
					isOpen: isOpenAdd,
					setIsOpen: setIsOpenAdd,
					closeModal: closeModalAdd,
					openModal: openModalAdd,
				}}
				title='Add a new MOOC'
			>
				<div className={`transition-all mt-2 `}>
					<Formik
						initialValues={addMOOCModel.initials}
						validationSchema={addMOOCModel.schema}
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
								<label className={classLabel} htmlFor='name'>
									MOOC Name
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

								<label className={classLabel} htmlFor='url'>
									MOOC URL
								</label>
								<input
									className={classInput}
									type='text'
									name='url'
									id='url'
									value={values.url}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.url && touched.url && errors.url}
								</span>

								<label className={classLabel} htmlFor='average_hours'>
									Average Hours
								</label>
								<input
									className={classInput}
									type='number'
									name='average_hours'
									id='average_hours'
									min={0}
									value={values.average_hours}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.average_hours &&
										touched.average_hours &&
										errors.average_hours}
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
									<span>{isSubmitting ? 'CREATING...' : 'CREATE'}</span>
								</button>
							</form>
						)}
					</Formik>
				</div>
			</Modal>

			<Modal
				{...{
					isOpen: isOpenEdit,
					setIsOpen: setIsOpenEdit,
					closeModal: closeModalEdit,
					openModal: openModalEdit,
				}}
				title='Edit a MOOC'
			>
				<div className={` transition-all mt-2 `}>
					<Formik
						initialValues={selected}
						validationSchema={editMOOCModel.schema}
						onSubmit={handleEdit}
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
								<label className={classLabel} htmlFor='name'>
									MOOC Name
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

								<label className={classLabel} htmlFor='url'>
									MOOC URL
								</label>
								<input
									className={classInput}
									type='text'
									name='url'
									id='url'
									value={values.url}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.url && touched.url && errors.url}
								</span>

								<label className={classLabel} htmlFor='average_hours'>
									Average Hours
								</label>
								<input
									className={classInput}
									type='number'
									name='average_hours'
									id='average_hours'
									min={0}
									value={values.average_hours}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.average_hours &&
										touched.average_hours &&
										errors.average_hours}
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
									<span>{isSubmitting ? 'EDITING...' : 'EDIT'}</span>
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
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/moocs`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { moocs } = data;

		return {
			props: {
				moocs,
			},
		};
	} catch (error) {
		return {
			props: {
				moocs: [],
			},
		};
	}
}
