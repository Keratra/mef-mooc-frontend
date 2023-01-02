import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import NextLink from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<h1 className='text-center text-5xl mb-16 drop-shadow-md'>
				Who are you?
			</h1>

			<section className='mx-auto grid grid-cols-1 gap-8'>
				<NextLink
					href='/coordinator/auth/login'
					className='
						text-center text-xl text-white 
						py-2 px-4 font-bold
						bg-[#212021] hover:bg-[#414041] 
						shadow-md rounded-xl border-none
						ring-2 ring-offset-0 ring-[#212021]
						hover:ring-4 hover:ring-offset-4 hover:ring-purple-900
						cursor-pointer transition-all
					'
				>
					Coordinator
				</NextLink>

				<NextLink
					href='/student/auth/login'
					className='
						text-center text-xl text-white 
						py-2 px-4 font-bold
						bg-[#212021] hover:bg-[#414041] 
						shadow-md rounded-xl border-none
						ring-2 ring-offset-0 ring-[#212021]
						hover:ring-4 hover:ring-offset-4 hover:ring-purple-900
						cursor-pointer transition-all
					'
				>
					Student
				</NextLink>

				<NextLink
					href='/admin/auth/login'
					className='
						text-center text-xl text-white 
						py-2 px-4 font-bold
						bg-[#212021] hover:bg-[#414041] 
						shadow-md rounded-xl border-none
						ring-2 ring-offset-0 ring-[#212021]
						hover:ring-4 hover:ring-offset-4 hover:ring-purple-900
						cursor-pointer transition-all
					'
				>
					Administrator
				</NextLink>
			</section>
		</div>
	);
}
