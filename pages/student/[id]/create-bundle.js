import NextLink from 'next/link';
import { Fragment, useState } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { useRouter } from 'next/router';
import Multiselect from 'multiselect-react-dropdown';
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

const people = [
	{ id: 1, name: 'Durward Reynolds' },
	{ id: 2, name: 'Kenton Towne' },
	{ id: 3, name: 'Therese Wunsch' },
	{ id: 4, name: 'Benedict Kessler' },
	{ id: 5, name: 'Katelyn Rohan' },
];

export default function CreateBundlePage({ course_id, moocs, mooc_details }) {
	const Router = useRouter();

	const [cart, setCart] = useState([]);
	const [selected, setSelected] = useState([]);
	const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]]);

	const handleSelect = (selectedList, selectedItem) => {
		try {
			if (
				Object.values(selected)
					.map(({ id }) => id)
					.includes(selectedItem.id)
			) {
				notify('warning', 'Already added the selected MOOC');
				return;
			}
			setSelected(() => [...selected, selectedItem]);
		} catch (error) {
			notify('error', 'Error adding MOOC');
		}
	};

	const handleRemove = (selectedList, selectedItem) => {
		try {
			setSelected(() => selected.filter((item) => item.id !== selectedItem.id));
		} catch (error) {
			notify('error', 'Error removing MOOC');
		}
	};

	const handleAdd = async () => {
		try {
			await axios.post('/api/student/create-bundle', {
				course_id: course_id,
				mooc_ids: selected.map(({ id }) => id),
			});

			Router.push(`/student/${Router.query.id}/bundles`);
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

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>Create your Bundle</PageTitle>

			<div className='min-w-[64rem] mb-4'>
				<Multiselect
					options={moocs} // Options to display in the dropdown
					selectedValues={selected} // Preselected value to persist in dropdown
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

			<div className='max-w-7xl mx-auto  flex flex-col overflow-x-auto w-full align-middle overflow-hidden border '>
				<KTable>
					<KTableHead
						tableHeaders={[
							{
								name: 'MOOC ID',
								alignment: 'left',
								className: 'rounded-tl-md',
							},
							{ name: 'MOOC Name', alignment: 'left' },
							{
								name: 'Average Hours',
								alignment: 'left',
							},
							{
								name: 'Link',
								alignment: 'left',
								className: 'rounded-tr-md',
							},
						]}
					></KTableHead>
					<KTableBody>
						{!!selected &&
							selected.map(({ id, name }) => (
								<tr key={id}>
									<td className=' px-4 py-4 text-lg font-medium whitespace-nowrap text-center'>
										{id}
									</td>
									<td className=' px-4 py-4 text-lg font-medium'>{name}</td>
									<td className=' px-4 py-4 text-lg font-medium'>
										{mooc_details[id]?.average_hours}
									</td>

									<td className=' px-4 py-4 text-lg font-medium min-w-[15vw]'>
										<NextLink
											href={mooc_details[id]?.url}
											target='_blank'
											className='text-blue-600 hover:underline underline-offset-2'
										>
											{mooc_details[id]?.url}
										</NextLink>
									</td>
								</tr>
							))}

						{selected?.length === 0 && (
							<EmptyTableMessage cols={4} message='No MOOCs were added...' />
						)}
					</KTableBody>
				</KTable>

				<div className=' px-4 py-4 text-lg font-medium text-center '>
					<button
						onClick={handleAdd}
						className={` py-1 px-3 text-white shadow-none text-center text-lg font-thin rounded-full bg-zinc-800 hover:bg-zinc-600 border-none cursor-pointer transition-colors `}
					>
						SUBMIT BUNDLE
					</button>
				</div>
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

		moocs?.forEach(({ id, name, url, average_hours }, index) => {
			mooc_details[id] = { id, name, url, average_hours };
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
