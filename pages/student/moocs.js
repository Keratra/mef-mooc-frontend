import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
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
	PauseIcon,
} from '@heroicons/react/24/solid';
import KTable from '@components/KTable';
import KTableHead from '@components/KTableHead';
import KTableBody from '@components/KTableBody';
import Tabs from '@components/Tabs';
import { notify } from 'utils/notify';

export default function MOOCListPage({ moocs }) {
	const Router = useRouter();

	return (
		<div className='flex flex-col justify-center items-center'>
			<PageTitle>MOOC List</PageTitle>

			<div className='max-w-7xl mx-auto  flex flex-col overflow-x-auto w-full align-middle overflow-hidden border shadow-lg'>
				<KTable>
					<KTableHead
						tableHeaders={[
							{
								name: 'MOOC ID',
								alignment: 'left',
								className: 'rounded-tl-md',
							},
							{ name: 'MOOC Name', alignment: 'left' },
							{ name: 'Average Hours', alignment: 'left' },
							{
								name: 'Link',
								alignment: 'left',
								className: 'rounded-tr-md',
							},
						]}
					></KTableHead>
					<KTableBody>
						{!!moocs &&
							moocs.map(({ id, url, average_hours, name }, idx) => (
								<tr
									key={id}
									className={
										idx % 2 === 0 ? 'bg-zinc-100' : 'bg-zinc-200/[0.75]'
									}
								>
									<td className='px-4 py-4 text-lg font-medium whitespace-nowrap '>
										{id}
									</td>
									<td className='px-4 py-4 text-lg font-medium'>{name}</td>
									<td className='px-4 py-4 text-lg font-medium'>
										{average_hours}
									</td>
									<td className='px-4 py-4 text-lg font-medium min-w-[15vw]'>
										<NextLink
											href={url}
											className='text-blue-600 hover:underline underline-offset-2'
										>
											{url}
										</NextLink>
									</td>
								</tr>
							))}
						{moocs?.length === 0 && (
							<EmptyTableMessage cols={4} message='No MOOCs were found...' />
						)}
					</KTableBody>
				</KTable>
			</div>
		</div>
	);
}

export async function getServerSideProps({ req }) {
	try {
		const token = req.cookies.token;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/moocs`;

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
		console.log(error);
		return {
			props: {
				moocs: [],
			},
		};
	}
}
