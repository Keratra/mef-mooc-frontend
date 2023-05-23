import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import {
	addDepartmentModel,
	changeCoordinatorModel,
	addCoordinatorModel,
	editStudentModel,
	editCoordinatorModel,
	inviteStudentModel,
} from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';
import { groupBy } from 'lodash';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import {
	UsersIcon,
	UserMinusIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/solid';
import { notify } from 'utils/notify';

export default function AdminDepartmentsPage({
	departments,
	passiveCoordinators,
	coordinators,
	students,
	departmentDict,
}) {
	const Router = useRouter();
	const [selected, setSelected] = useState(0);
	const [selectedCoordinator, setSelectedCoordinator] = useState({
		id: -1,
		name: '',
		surname: '',
		email: '',
	});
	const [selectedStudent, setSelectedStudent] = useState({
		id: -1,
		name: '',
		surname: '',
		email: '',
		student_no: '',
		department_id: -1,
	});
	const [selectedTabs, setSelectedTabs] = useState(1); // tabs

	const [isOpenAdd, setIsOpenAdd] = useState(false);
	const [isOpenChange, setIsOpenChange] = useState(false);
	const [isOpenAddCo, setIsOpenAddCo] = useState(false);
	const [isOpenCo, setIsOpenCo] = useState(false);
	const [isOpenStudent, setIsOpenStudent] = useState(false);
	const [isOpenInviteMultiple, setIsOpenInviteMultiple] = useState(false);
	const [isOpenInviteSingle, setIsOpenInviteSingle] = useState(false);

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

	function closeModalAddCo() {
		setIsOpenAddCo(false);
	}
	function openModalAddCo() {
		setIsOpenAddCo(true);
	}

	function openModalCo() {
		setIsOpenCo(true);
	}
	function closeModalCo() {
		setIsOpenCo(false);
	}

	function closeModalStudent() {
		setIsOpenStudent(false);
		setSelectedStudent({
			name: '',
			surname: '',
			email: '',
			student_no: '',
			department_name: '',
		});
	}
	function openModalStudent() {
		setIsOpenStudent(true);
	}

	function closeModalInviteMultiple() {
		setIsOpenInviteMultiple(false);
	}
	function openModalInviteMultiple() {
		setIsOpenInviteMultiple(true);
	}

	function closeModalInviteSingle() {
		setIsOpenInviteSingle(false);
	}
	function openModalInviteSingle() {
		setIsOpenInviteSingle(true);
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

	const handleAdd = async (
		{ code, name, coordinator_id },
		{ setSubmitting }
	) => {
		// alert(JSON.stringify({ name, coordinator_id }, null, 2));

		try {
			if (coordinator_id === 0) throw 'Please select a coordinator';

			await axios.post(`/api/admin/add-department`, {
				code,
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

	const handleRemove = async (coordinator_id) => {
		// alert(JSON.stringify({ coordinator_id }, null, 2));

		try {
			if (coordinator_id === 0) throw 'Please select a coordinator';
			if (!confirm('Are you sure about deleting the coordinator?')) return;

			await axios.post(`/api/admin/delete-coordinator`, {
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
		}
	};

	const handleAddCo = async ({ name, surname, email }, { setSubmitting }) => {
		// alert(JSON.stringify({ name, surname, email }, null, 2));

		try {
			const { data } = await axios.post(`/api/admin/add-coordinator`, {
				name,
				surname,
				email,
			});

			notify('success', data?.message ?? 'Successfully added');

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

	const handleEditStudent = async (
		{ id, name, surname, email, student_no, department_id },
		{ setSubmitting }
	) => {
		try {
			if (id <= 0) throw 'Please select a student';
			if (department_id <= 0) throw 'Please select a valid department';

			await axios.post(`/api/admin/edit-student`, {
				id,
				name,
				surname,
				email,
				student_no,
				department_id,
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

	const handleEditCoordinator = async (
		{ id, name, surname, email },
		{ setSubmitting }
	) => {
		try {
			if (id <= 0) throw 'Please select a coordinator';

			await axios.post(`/api/admin/edit-coordinator`, {
				id,
				name,
				surname,
				email,
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

	const handleInviteMultipleStudent = async ({}) => {
		try {
			// if (department_id <= 0) throw 'Please select a valid department';

			// await axios.post(`/api/admin/invite-students`, {
			// 	students: [
			// 		{
			// 			name,
			// 			surname,
			// 			email,
			// 			student_no,
			// 			department_id,
			// 		},
			// 	],
			// });

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
			// setSubmitting(false);
		}
	};

	const handleInviteSingleStudent = async (
		{ name, surname, email, student_no, department_id },
		{ setSubmitting }
	) => {
		try {
			if (department_id <= 0) throw 'Please select a valid department';

			await axios.post(`/api/admin/invite-students`, {
				students: [
					{
						name,
						surname,
						email,
						student_no,
						department_id,
					},
				],
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
			<PageTitle>Dashboard</PageTitle>

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
						<span className='drop-shadow-md select-none '>Coordinators</span>
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
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<span className='drop-shadow-md select-none '>Departments</span>
					</div>
					<div
						onClick={() => setSelectedTabs(2)}
						className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2
							${
								selectedTabs === 2
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
					>
						<span className='drop-shadow-md select-none '>Students</span>
					</div>
				</div>
			</section>

			{selectedTabs === 0 && (
				<div className='w-full max-w-6xl mx-auto'>
					<table className='w-full border-spacing-0 rounded-lg border-solid border-2 border-zinc-300 shadow-lg  '>
						<thead className='bg-gradient-to-t from-zinc-300 to-zinc-200 text-black'>
							<tr>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tl-md`}
								>
									<span className='text-center drop-shadow-md'>Name</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Email</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Department</span>
								</th>
								<th
									scope='col'
									align='center'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tr-md`}
								>
									<span className='text-center drop-shadow-md'>Delete</span>
								</th>
								<th
									scope='col'
									align='center'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tr-md`}
								>
									<span className='text-center drop-shadow-md'>Edit</span>
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200'>
							{!!coordinators &&
								coordinators.map(
									({ id, name, surname, email, department_name }, idx) => (
										<tr
											key={id}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{name} {surname}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{email}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{department_name ?? (
													<span className='text-red-700 animate-pulse'>
														Not assigned
													</span>
												)}
											</td>
											<td className='flex justify-center items-center px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
												<button
													onClick={() => handleRemove(id)}
													className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
												>
													<UserMinusIcon className='h-7 w-7 text-red-700' />
												</button>
											</td>
											<td className='px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
												<button
													onClick={() => {
														setSelectedCoordinator({
															id,
															name,
															surname,
															email,
														});
														openModalCo();
													}}
													className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
												>
													<PencilSquareIcon className='h-7 w-7 text-zinc-700' />
												</button>
											</td>
										</tr>
									)
								)}
							{coordinators?.length === 0 && (
								<EmptyTableMessage
									cols={4}
									message='No coordinators were found...'
								/>
							)}
						</tbody>
					</table>

					<div className=' px-4 py-4 text-lg font-medium text-center '>
						<button
							onClick={() => openModalAddCo()}
							className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
						>
							CREATE COORDINATOR
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
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tl-md`}
								>
									<span className='text-center drop-shadow-md'>
										Department Code
									</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>
										Department Name
									</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>
										Current Coordinator
									</span>
								</th>
								<th
									scope='col'
									align='center'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tr-md`}
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
									(
										{ id, code, name, coordinator_name, coordinator_surname },
										idx
									) => (
										<tr
											key={id}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{code}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{name}
											</td>
											<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{coordinator_name} {coordinator_surname}
											</td>
											<td className=' flex justify-center items-center px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
												<button
													onClick={() => {
														handleSelect(id);
														openModalChange();
													}}
													className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
												>
													<UsersIcon className='h-7 w-7 text-black hover:text-zinc-500' />
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
							className={` mx-auto py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
						>
							CREATE DEPARTMENT
						</button>
					</div>
				</div>
			)}

			{selectedTabs === 2 && (
				<div className='w-full max-w-6xl mx-auto'>
					<table className='w-full border-spacing-0 rounded-lg border-solid border-2 border-zinc-300 shadow-lg  '>
						<thead className='bg-gradient-to-t from-zinc-300 to-zinc-200 text-black'>
							<tr>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tl-md`}
								>
									<span className='text-center drop-shadow-md'>Name</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Email</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Student NO</span>
								</th>
								<th
									scope='col'
									align='left'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl`}
								>
									<span className='text-center drop-shadow-md'>Department</span>
								</th>
								<th
									scope='col'
									align='center'
									className={`min-w-[170px] px-4 py-2 font-semibold text-xl rounded-tr-md`}
								>
									<span className='text-center drop-shadow-md'>Edit</span>
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200'>
							{!!students &&
								students.map(
									(
										{ id, name, surname, email, student_no, department_name },
										idx
									) => (
										<tr
											key={id}
											className={
												idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
											}
										>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{name} {surname}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{email}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{student_no}
											</td>
											<td className='px-4 py-4 text-lg font-medium whitespace-nowrap'>
												{department_name ?? (
													<span className='text-red-700 animate-pulse'>
														Not assigned
													</span>
												)}
											</td>
											<td className='flex justify-center items-center px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
												<button
													onClick={() => {
														const department_id = departments.find(
															({ name }) => name === department_name
														)?.id;

														setSelectedStudent({
															id,
															name,
															surname,
															email,
															student_no,
															department_id,
														});
														openModalStudent();
													}}
													className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
												>
													<PencilSquareIcon className='h-7 w-7 text-zinc-900' />
												</button>
											</td>
										</tr>
									)
								)}
							{coordinators?.length === 0 && (
								<EmptyTableMessage
									cols={5}
									message='No students were found...'
								/>
							)}
						</tbody>
					</table>

					<div className=' grid grid-cols-2 gap-2 px-4 py-4 text-lg font-medium text-center '>
						<button
							onClick={() => openModalInviteMultiple()}
							className={` mx-auto py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
						>
							INVITE STUDENTS
						</button>

						<button
							onClick={() => openModalInviteSingle()}
							className={` mx-auto py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
						>
							INVITE A STUDENT
						</button>
					</div>
				</div>
			)}

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
								<label className={classLabel} htmlFor='code'>
									Department Code
								</label>
								<input
									className={classInput}
									type='text'
									name='code'
									id='code'
									value={values.code}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.code && touched.code && errors.code}
								</span>

								<label className={classLabel} htmlFor='name'>
									Department Name
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
									Available Coordinators
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
									{!!passiveCoordinators &&
										passiveCoordinators.map(({ id, coordinator_name }) => (
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
									{!!passiveCoordinators &&
										passiveCoordinators.map(({ id, coordinator_name }) => (
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
					isOpen: isOpenAddCo,
					setIsOpen: setIsOpenAddCo,
					closeModal: closeModalAddCo,
					openModal: openModalAddCo,
				}}
				title='Add a new coordinator'
			>
				<div className={`transition-all mt-2 `}>
					<Formik
						initialValues={addCoordinatorModel.initials}
						validationSchema={addCoordinatorModel.schema}
						onSubmit={handleAddCo}
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

								<label className={classLabel} htmlFor='surname'>
									Surname
								</label>
								<input
									className={classInput}
									type='text'
									name='surname'
									id='surname'
									value={values.surname}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.surname && touched.surname && errors.surname}
								</span>

								<label className={classLabel} htmlFor='email'>
									Email
								</label>
								<input
									className={classInput}
									type='text'
									name='email'
									id='email'
									value={values.email}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.email && touched.email && errors.email}
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
									<span>{isSubmitting ? 'Adding...' : 'Add Coordinator'}</span>
								</button>
							</form>
						)}
					</Formik>
				</div>
			</Modal>

			<Modal
				{...{
					isOpen: isOpenCo,
					setIsOpen: setIsOpenCo,
					closeModal: closeModalCo,
					openModal: openModalCo,
				}}
				title='Edit the coordinator'
			>
				<div className={`transition-all mt-2`}>
					<Formik
						initialValues={selectedCoordinator}
						validationSchema={editCoordinatorModel.schema}
						onSubmit={handleEditCoordinator}
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

								<label className={classLabel} htmlFor='surname'>
									Surname
								</label>
								<input
									className={classInput}
									type='text'
									name='surname'
									id='surname'
									value={values.surname}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.surname && touched.surname && errors.surname}
								</span>

								<label className={classLabel} htmlFor='email'>
									Email
								</label>
								<input
									className={classInput}
									type='text'
									name='email'
									id='email'
									value={values.email}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.email && touched.email && errors.email}
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
									<span>
										{isSubmitting ? 'Editing...' : 'Edit Coordinator'}
									</span>
								</button>
							</form>
						)}
					</Formik>
				</div>
			</Modal>

			<Modal
				{...{
					isOpen: isOpenStudent,
					setIsOpen: setIsOpenStudent,
					closeModal: closeModalStudent,
					openModal: openModalStudent,
				}}
				title='Edit the student'
			>
				<div className={`transition-all mt-2`}>
					<Formik
						initialValues={selectedStudent}
						validationSchema={editStudentModel.schema}
						onSubmit={handleEditStudent}
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

								<label className={classLabel} htmlFor='surname'>
									Surname
								</label>
								<input
									className={classInput}
									type='text'
									name='surname'
									id='surname'
									value={values.surname}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.surname && touched.surname && errors.surname}
								</span>

								<label className={classLabel} htmlFor='email'>
									Email
								</label>
								<input
									className={classInput}
									type='text'
									name='email'
									id='email'
									value={values.email}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.email && touched.email && errors.email}
								</span>

								<label className={classLabel} htmlFor='student_no'>
									Student NO
								</label>
								<input
									className={classInput}
									type='text'
									name='student_no'
									id='student_no'
									value={values.student_no}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.student_no && touched.student_no && errors.student_no}
								</span>

								<label className={classLabel} htmlFor='department_id'>
									Department
								</label>
								<select
									name='department_id'
									id='department_id'
									className={classInput}
									value={values.department_id}
									onChange={(e) => {
										setFieldValue('department_id', e.target.value);
									}}
								>
									{!!departments &&
										departments.map(({ id, name }, i) => (
											<option key={i} value={id}>
												{name}
											</option>
										))}
								</select>

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
									<span>{isSubmitting ? 'Editing...' : 'Edit Student'}</span>
								</button>
							</form>
						)}
					</Formik>
				</div>
			</Modal>

			<Modal
				{...{
					isOpen: isOpenInviteMultiple,
					setIsOpen: setIsOpenInviteMultiple,
					closeModal: closeModalInviteMultiple,
					openModal: openModalInviteMultiple,
				}}
				title='Invite multiple students'
			>
				<div className={`transition-all mt-2`}>Excel Upload Here...</div>
			</Modal>

			<Modal
				{...{
					isOpen: isOpenInviteSingle,
					setIsOpen: setIsOpenInviteSingle,
					closeModal: closeModalInviteSingle,
					openModal: openModalInviteSingle,
				}}
				title='Invite a student'
			>
				<div className={`transition-all mt-2`}>
					<Formik
						initialValues={inviteStudentModel.initials}
						validationSchema={inviteStudentModel.schema}
						onSubmit={handleInviteSingleStudent}
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

								<label className={classLabel} htmlFor='surname'>
									Surname
								</label>
								<input
									className={classInput}
									type='text'
									name='surname'
									id='surname'
									value={values.surname}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.surname && touched.surname && errors.surname}
								</span>

								<label className={classLabel} htmlFor='email'>
									Email
								</label>
								<input
									className={classInput}
									type='text'
									name='email'
									id='email'
									value={values.email}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.email && touched.email && errors.email}
								</span>

								<label className={classLabel} htmlFor='student_no'>
									Student NO
								</label>
								<input
									className={classInput}
									type='text'
									name='student_no'
									id='student_no'
									value={values.student_no}
									onChange={handleChange}
								/>
								<span className={classError}>
									{errors.student_no && touched.student_no && errors.student_no}
								</span>

								<label className={classLabel} htmlFor='department_id'>
									Department
								</label>
								<select
									name='department_id'
									id='department_id'
									className={classInput}
									value={values.department_id}
									onChange={(e) => {
										setFieldValue('department_id', e.target.value);
									}}
								>
									{!!departments &&
										departments.map(({ id, name }, i) => (
											<option key={i} value={id}>
												{name}
											</option>
										))}
								</select>

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
									<span>{isSubmitting ? 'Inviting...' : 'Invite Student'}</span>
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
		const backendURLPC = `${process.env.NEXT_PUBLIC_API_URL}/admin/passive-coordinators`;
		const backendURLC = `${process.env.NEXT_PUBLIC_API_URL}/admin/coordinators`;
		const backendURLS = `${process.env.NEXT_PUBLIC_API_URL}/admin/students`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataPC } = await axios.get(backendURLPC, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataC } = await axios.get(backendURLC, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { data: dataS } = await axios.get(backendURLS, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { departments } = data;
		const { coordinators: passiveCoordinators } = dataPC;
		const { coordinators } = dataC;
		const { students } = dataS;

		const departmentDict = groupBy(departments, (department) => {
			return department.id;
		});

		return {
			props: {
				departments: departments ?? [],
				passiveCoordinators: passiveCoordinators ?? [],
				coordinators: coordinators ?? [],
				students: students ?? [],
				departmentDict: departmentDict ?? {},
			},
		};
	} catch (error) {
		return {
			props: {
				departments: [],
				passiveCoordinators: [],
				coordinators: [],
				students: [],
				departmentDict: {},
			},
		};
	}
}
