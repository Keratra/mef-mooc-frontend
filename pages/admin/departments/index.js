import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addDepartmentModel, changeCoordinatorModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { groupBy } from 'lodash';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import { UsersIcon } from '@heroicons/react/24/solid';

export default function AdminDepartmentsPage({
	departments,
	coordinators,
	departmentDict,
}) {
	const Router = useRouter();
	const [selected, setSelected] = useState(0);

	const [isOpenAdd, setIsOpenAdd] = useState(false);
	const [isOpenChange, setIsOpenChange] = useState(false);

	function closeModalAdd() {
		setIsOpenAdd(false);
	}

	function openModalAdd() {
		setIsOpenAdd(true);
	}

	function closeModalChange() {
		setIsOpenChange(false);
	}

	function openModalChange() {
		setIsOpenChange(true);
	}

	const handleSelect = async (department_id) => {
		setSelected(department_id);
	};

	const handleChange = async (
		{ department_id, coordinator_id },
		{ setSubmitting }
	) => {
		// alert(JSON.stringify({ department_id, coordinator_id }, null, 2));

		try {
			if (selected === 0) throw 'Please select a department';
			if (coordinator_id === 0) throw 'Please select a coordinator';
			if (!confirm('Are you sure about changing the coordinator?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/admin/change-coordinator`, {
				department_id: selected,
				coordinator_id,
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
		}
	};

	const handleAdd = async ({ name, coordinator_id }, { setSubmitting }) => {
		// alert(JSON.stringify({ name, coordinator_id }, null, 2));

		try {
			if (coordinator_id === 0) throw 'Please select a coordinator';

			await axios.post(`/api/admin/add-department`, {
				name,
				coordinator_id,
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
			<PageTitle>Departments</PageTitle>

			<div className='w-full'>
				<table className='max-w-5xl mx-auto border-collapse border-solid border-2 border-zinc-300 shadow-lg '>
					<thead className='bg-gradient-to-t from-zinc-300 to-zinc-200 text-black'>
						<tr>
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
								<span className='text-center drop-shadow-md'>Coordinator</span>
							</th>
							<th
								scope='col'
								align='left'
								className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
							>
								<span className='text-center drop-shadow-md'>
									Change Coordinator
								</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!departments &&
							departments.map(
								({ id, name, coordinator_name, coordinator_surname }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{name}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{coordinator_name} {coordinator_surname}
										</td>
										<td className=' align-middle px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => {
													handleSelect(id);
													openModalChange();
												}}
												className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
											>
												<UsersIcon className='h-7 w-7 text-black' />
											</button>
										</td>
									</tr>
								)
							)}
						{departments?.length === 0 && (
							<EmptyTableMessage
								cols={3}
								message='No departments were found...'
							/>
						)}
					</tbody>
				</table>

				<div className=' px-4 py-4 text-lg font-medium text-center '>
					<button
						onClick={() => openModalAdd()}
						className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
					>
						CREATE DEPARTMENT
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
				title='Add a new department'
			>
				<div className={`transition-all mt-2 `}>
					<Formik
						initialValues={addDepartmentModel.initials}
						validationSchema={addDepartmentModel.schema}
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

								<label className={classLabel} htmlFor='coordinator_id'>
									Coordinator
								</label>
								<select
									name='coordinator_id'
									id='coordinator_id'
									className={classInput}
									value={values.coordinator_id}
									onChange={(e) => {
										setFieldValue('coordinator_id', e.target.value);
									}}
								>
									<option value={0}>None</option>
									{!!coordinators &&
										coordinators.map(({ id, coordinator_name }) => (
											<option key={id} value={id}>
												{coordinator_name}
											</option>
										))}
								</select>
								<span className={classError}>
									{errors.coordinator_id &&
										touched.coordinator_id &&
										errors.coordinator_id}
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
					isOpen: isOpenChange,
					setIsOpen: setIsOpenChange,
					closeModal: closeModalChange,
					openModal: openModalChange,
				}}
				title='CHANGE COORDINATOR'
			>
				<div className={` transition-all mt-2 `}>
					<Formik
						initialValues={changeCoordinatorModel.initials}
						validationSchema={changeCoordinatorModel.schema}
						onSubmit={handleChange}
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
									Current Coordinator
								</label>
								<span
									className={
										classInput + ' border-solid border-2 border-neutral-400'
									}
								>
									{selected === 0
										? 'Please select a department...'
										: `${departmentDict[selected][0]?.coordinator_name} ${departmentDict[selected][0]?.coordinator_surname}`}
								</span>
								<span className={classError}>
									{errors.name && touched.name && errors.name}
								</span>

								<label className={classLabel} htmlFor='coordinator_id'>
									New Coordinator
								</label>
								<select
									name='coordinator_id'
									id='coordinator_id'
									className={classInput}
									value={values.coordinator_id}
									onChange={(e) => {
										setFieldValue('coordinator_id', e.target.value);
									}}
								>
									<option value={0}>None</option>
									{!!coordinators &&
										coordinators.map(({ id, coordinator_name }) => (
											<option key={id} value={id}>
												{coordinator_name}
											</option>
										))}
								</select>
								<span className={classError}>
									{errors.coordinator_id &&
										touched.coordinator_id &&
										errors.coordinator_id}
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
		</div>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/departments`;
		const backendURLC = `${process.env.NEXT_PUBLIC_API_URL}/admin/passive-coordinators`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataC } = await axios.get(backendURLC, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { departments } = data;
		const { coordinators } = dataC;

		const departmentDict = groupBy(departments, (department) => {
			return department.id;
		});

		return {
			props: {
				departments: departments ?? [],
				coordinators: coordinators ?? [],
				departmentDict: departmentDict ?? {},
			},
		};
	} catch (error) {
		return {
			props: {
				departments: [],
				coordinators: [],
				departmentDict: {},
			},
		};
	}
}
