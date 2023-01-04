import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { addCoordinatorModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import EmptyTableMessage from '@components/EmptyTableMessage';

export default function AdminCoordinatorsPage({ coordinators }) {
	const Router = useRouter();

	const handleRemove = async (coordinator_id) => {
		// alert(JSON.stringify({ coordinator_id }, null, 2));

		try {
			if (coordinator_id === 0) throw 'Please select a coordinator';
			if (!confirm('Are you sure about deleting the coordinator?'))
				throw new Error('Action refused by user');

			await axios.post(`/api/admin/delete-coordinator`, {
				coordinator_id,
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

	const handleAdd = async ({ name, surname, email }, { setSubmitting }) => {
		// alert(JSON.stringify({ name, surname, email }, null, 2));

		try {
			await axios.post(`/api/admin/add-coordinator`, {
				name,
				surname,
				email,
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
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>Coordinators</h1>

			<div className='flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
				<table className='min-w-full border-solid border-0 border-b-2 border-collapse'>
					<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
						<tr>
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
								<span className='text-center drop-shadow-md'>Email</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Department</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
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
										<td className='align-baseline px-4 py-4 text-lg font-medium text-center whitespace-nowrap'>
											<button
												onClick={() => handleRemove(id)}
												className='text-center text-lg py-1 px-3 bg-red-700 hover:bg-red-500 shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'
											>
												X
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
			</div>

			<div
				className={`max-w-md md:max-w-2xl mx-auto mt-12 mb-2 md:px-6 transition-all shadow-lg border-solid border-neutral-200 hover:border-neutral-300 rounded-md `}
			>
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
							<h2 className='md:col-span-2 mt-4 text-center text-3xl drop-shadow-md'>
								Add a new Coordinator
							</h2>

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
