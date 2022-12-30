import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import NextLink from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className='h-[80vh] flex flex-col justify-center items-center'>
      <h1 className='text-center text-5xl mb-16 drop-shadow-md'>
        Who are you?
      </h1>

      <section className='mx-auto grid grid-cols-1 gap-4'>
        <NextLink
          href='/coordinator/auth/login'
          className='text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'
        >
          Coordinator
        </NextLink>

        <NextLink
          href='/student/auth/login'
          className='text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'
        >
          Student
        </NextLink>

        <NextLink
          href='/admin/auth/login'
          className='text-center text-xl py-2 px-4 bg-[#212021] hover:bg-[#414041] shadow-md text-white font-bold rounded-lg border-none cursor-pointer transition-colors'
        >
          Administrator
        </NextLink>
      </section>
      {/* <form action = "http://localhost:3000/student/auth/login" method = "post">
      <h1 className='text-center text-5xl mb-16 drop-shadow-md'>
       Student Register
      </h1>
          <table>
              <tr>
                  <td>Email:</td>
                  <td><input type = "text" name = "username" /></td>
              </tr>
              <tr>
                  <td>Student No:</td>
                  <td><input type = "text" name = "number" /></td>
              </tr>
              <tr>  
                  <td>Password:</td>
                  <td><input type = "password" name = "password" /></td>
              </tr> 

              <tr>  
                  <td>Confirm Password:</td>
                  <td><input type = "password" name = "password" /></td>
              </tr> 
              <tr>
                  <td><input type = "submit" value = "Register" /></td>
              </tr>
          </table>
      </form> */}

      {/* <div className="flex flex-col justify-center items-center">
          <h1 className='text-center text-5xl mb-16 drop-shadow-md'>
        Available Courses
      </h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Semester</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Select</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Introduction </td>
            <td className="border px-4 py-2">COMP 100</td>
            <td className="border px-4 py-2">cem</td>
          </tr>
          <tr className="bg-gray-100">
          <td className="border px-4 py-2">Introduction </td>
            <td className="border px-4 py-2">COMP 100</td>
            <td className="border px-4 py-2">cem</td>
          </tr>
          <tr>
          <td className="border px-4 py-2">Introduction </td>
            <td className="border px-4 py-2">COMP 100</td>
            <td className="border px-4 py-2">cem</td>
          </tr>
        </tbody>
      </table>
      </div> */}

      {/* <div className={styles.center}>
          <Image
            className={styles.logo}
            src='/next.svg'
            alt='Next.js Logo'
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src='/thirteen.svg'
              alt='13'
              width={40}
              height={31}
              priority
            />
          </div>
        </div> */}
    </div>
  );
}
