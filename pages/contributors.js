import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

const makers = [
	{
		name: 'Kerem Kaya',
		student_no: '042001003',
	},
	{
		name: 'Diogenes',
		student_no: '042001004',
	},
	{
		name: 'Socrates',
		student_no: '042001005',
	},
	{
		name: 'Plato',
		student_no: '042001006',
	},
	{
		name: 'Aristotle',
		student_no: '042001007',
	},
	{
		name: 'Homer',
		student_no: '042001008',
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
			<h1 className='mt-16 mb-1 text-5xl'>Contributors</h1>
			<p>Order is randomized every refresh</p>
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
