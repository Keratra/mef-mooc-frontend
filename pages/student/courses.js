import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { loginStudentModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ___________Page() {
  const Router = useRouter();

  return (
    <div>
      <h1>Kerem abi</h1>
      <span>adspfgkaspogjfsdpobfdpojtıpu</span>
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
