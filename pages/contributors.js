import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';
import PageTitle from '@components/PageTitle';

const makers = [
	{
		name: 'Kerem Kaya',
		student_no: '042001003',
	},
	{
		name: 'Mustafa Mert Tunalı',
		student_no: '041801124',
	},
	{
		name: 'Ahmet Yıldız',
		student_no: '041901008',
	},
	{
		name: 'Cem Baysal',
		student_no: '042101005',
	},
	{
		name: 'Pelin Mişe',
		student_no: '041901015',
	},
	{
		name: 'Mehmet Talha Bozan',
		student_no: '041901020',
	},
];

export default function ContributorsPage() {
	const Router = useRouter();
	const [randomArray, setRandomArray] = useState([]);

	useEffect(() => {
		const randomizeArray = [...makers].sort(() => 0.5 - Math.random());
		setRandomArray(randomizeArray);
	}, []);

	return (
		<div className='text-center'>
			<PageTitle>Contributors</PageTitle>
			<p className='-mt-2'>Order is randomized every refresh</p>
			<section className='grid grid-cols-1 gap-4 my-12'>
				{randomArray.map(({ name, student_no }) => (
					<div
						key={student_no}
						className='max-w-xs mx-auto cursor-default hover:text-purple-800 transiiton-all'
					>
						<h2 className='font-medium drop-shadow-md'>{name}</h2>
						<span className=' drop-shadow-md'>{student_no}</span>
					</div>
				))}
			</section>
		</div>
	);
}

// export async function getServerSideProps(context) {
//   const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/all-departments`;

//   const { data } = await axios.get(backendURL);

//   const { departments } = data;

//   return {
//     props: {
//       departments,
//     },
//   };
// }
