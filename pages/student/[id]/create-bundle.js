import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { useRouter } from 'next/router';
import Multiselect from 'multiselect-react-dropdown';
import { Artifika } from '@next/font/google';

export default function CreateBundlePage({ course_id, moocs, mooc_details }) {
	const Router = useRouter();

	const [cart, setCart] = useState([]);

	const handleSelect = (selectedList, selectedItem) => {
		try {
			if (cart.includes(selectedItem.id)) return;
			setCart(() => [...cart, selectedItem.id]);
		} catch (error) {
			0;
		}
	};

	const handleRemove = (selectedList, selectedItem) => {
		try {
			setCart(() => selectedList.filter((item) => item !== selectedItem.id));
		} catch (error) {
			0;
		}
	};

	const handleAdd = async () => {
		try {
			await axios.post('/api/student/create-bundle', {
				course_id: course_id,
				mooc_ids: cart,
			});

			Router.reload();
		} catch (error) {
			console.log(error);
			alert(
				error?.response?.data?.message?.message ??
					error?.response?.data?.message ??
					error?.message
			);
		}
	};

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>
				Creating a Bundle
			</h1>

			<div className='min-w-[64rem] mt-2'>
				<Multiselect
					options={moocs} // Options to display in the dropdown
					selectedValues={cart} // Preselected value to persist in dropdown
					onSelect={handleSelect} // Function will trigger on select event
					onRemove={handleRemove} // Function will trigger on remove event
					displayValue='name' // Property name to display in the dropdown options
					singleSelect={true}
					placeholder='Select a MOOC'
					style={{
						chips: {
							padding: '1rem',
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

			<div className='flex flex-col overflow-x-auto p-1.5 w-full align-middle overflow-hidden border'>
				<table className='min-w-full border-solid border-0 border-b-2 border-collapse'>
					<thead className='bg-gradient-to-t from-[#212021] to-[#414041] text-white'>
						<tr>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>MOOC ID</span>
							</th>
							<th
								scope='col'
								className={`min-w-[20vw]  px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>MOOC Name</span>
							</th>
							<th
								scope='col'
								className={`min-w-[170px] px-4 py-2 font-bold text-center text-2xl`}
							>
								<span className='text-center drop-shadow-md'>Link</span>
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{!!cart &&
							cart.map((id) => (
								<tr key={id}>
									<td className='align-baseline px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
										{id}
									</td>
									<td className='align-baseline px-4 py-4 text-lg font-medium'>
										{mooc_details[id]?.name}
									</td>

									<td className='align-baseline px-4 py-4 text-lg font-medium min-w-[15vw]'>
										<NextLink
											href={mooc_details[id]?.url}
											className='text-blue-600 hover:underline underline-offset-2'
										>
											{mooc_details[id]?.url}
										</NextLink>
									</td>
								</tr>
							))}
						{cart?.length === 0 && (
							<tr>
								<td
									colSpan={4}
									className='w-full p-2 text-2xl text-neutral-500 text-center drop-shadow-lg'
								>
									Add a MOOC to your bundle...
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div>
				<button
					onClick={handleAdd}
					className='justify-self-end self-end place-self-end text-lg mt-4 py-2 px-5 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-thin rounded-full border-none cursor-pointer transition-colors'
				>
					SUBMIT BUNDLE
				</button>
			</div>
		</div>
	);
}

export async function getServerSideProps({ req, query }) {
	try {
		const { id } = query;
		const token = req.cookies.token;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/moocs`;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const { moocs } = data;

		const mooc_details = {};

		moocs?.forEach(({ id, name, url }, index) => {
			mooc_details[id] = { id, name, url };
		});

		return {
			props: {
				course_id: id,
				moocs: moocs ?? [],
				mooc_details: mooc_details ?? {},
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				course_id: 0,
				moocs: [],
				mooc_details: {},
			},
		};
	}
}
