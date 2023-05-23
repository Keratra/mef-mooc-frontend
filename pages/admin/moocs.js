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

export default function AdminMOOCsPage({ moocs }) {
	const Router = useRouter();
	const [selected, setSelected] = useState({
		id: 0,
		name: '',
		url: '',
		average_hours: '',
	});

	const [isOpenAdd, setIsOpenAdd] = useState(false);
	const [isOpenEdit, setIsOpenEdit] = useState(false);

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
				<KTable>
					<KTableHead
						tableHeaders={[
							{
								name: 'MOOC Name',
								alignment: 'left',
								className: 'rounded-tl-md',
							},
							{ name: 'Certificate Link', alignment: 'left' },
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
											{url}
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
				<div className=' px-4 py-4 text-lg font-medium text-center '>
					<button
						onClick={() => openModalAdd()}
						className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
					>
						CREATE MOOC
					</button>
				</div>
			</div>

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
