import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ___________Page() {
	const Router = useRouter();

	return (
		<div className='text-center'>
			<h1 className='mt-16'>Contributors</h1>
			<span>Kerem Kaya from Sinope</span>
			<div>Friends with Diogenes</div>
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
