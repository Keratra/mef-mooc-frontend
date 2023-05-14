import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addCoordinatorModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';
import PageTitle from '@components/PageTitle';
import Modal from '@components/Modal';
import { UserMinusIcon } from '@heroicons/react/24/solid';
import { notify } from 'utils/notify';

export default function AdminCoordinatorsPage({ coordinators }) {
	const Router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

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

	const handleAdd = async ({ name, surname, email }, { setSubmitting }) => {
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
			<PageTitle>Coordinators</PageTitle>

			<div className='w-full'>
				<table className='max-w-5xl mx-auto border-collapse border-solid border-2 border-zinc-300 shadow-lg '>
					<thead className='bg-gradient-to-t from-zinc-300 to-zinc-200 text-black'>
						<tr>
							<th
								scope='col'
								align='left'
								className={`min-w-[170px] px-4 py-2 font-semibold text-center text-xl`}
							>
								<span className='text-center drop-shadow-md'>Name</span>
							</th>
							<th
								scope='col'
								align='left'
								className={`min-w-[170px] px-4 py-2 font-semibold text-center text-xl`}
							>
								<span className='text-center drop-shadow-md'>Email</span>
							</th>
							<th
								scope='col'
								align='left'
								className={`min-w-[170px] px-4 py-2 font-semibold text-center text-xl`}
							>
								<span className='text-center drop-shadow-md'>Department</span>
							</th>
							<th
								scope='col'
								align='left'
								className={`min-w-[170px] px-4 py-2 font-semibold text-center text-xl`}
							>
								<span className='text-center drop-shadow-md'>Delete</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!coordinators &&
							coordinators.map(
								({ id, name, surname, email, department_name }) => (
									<tr
										key={id}
										className='border-solid border-0 border-b border-neutral-200'
									>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{name} {surname}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{email}
										</td>
										<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap'>
											{department_name ?? (
												<span className='text-red-700 animate-pulse'>
													Not assigned
												</span>
											)}
										</td>
										<td className='align-middle px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => handleRemove(id)}
												className={` bg-transparent  text-center font-thin border-none cursor-pointer transition-colors`}
											>
												<UserMinusIcon className='h-7 w-7 text-red-700' />
											</button>
										</td>
									</tr>
								)
							)}
						{coordinators?.length === 0 && (
							<EmptyTableMessage
								cols={3}
								message='No coordinators were found...'
							/>
						)}
					</tbody>
				</table>

				<div className=' px-4 py-4 text-lg font-medium text-center '>
					<button
						onClick={() => openModal()}
						className={` py-1 px-3 shadow-md text-white text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
					>
						CREATE COORDINATOR
					</button>
				</div>
			</div>

			<Modal
				{...{ isOpen, setIsOpen, closeModal, openModal }}
				title='Create Coordinator'
			>
				<div className={` transition-all `}>
					<Formik
						initialValues={addCoordinatorModel.initials}
						validationSchema={addCoordinatorModel.schema}
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
		</div>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/coordinators`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { coordinators } = data;

		return {
			props: {
				coordinators: coordinators ?? [],
			},
		};
	} catch (error) {
		return {
			props: {
				coordinators: [],
			},
		};
	}
}
