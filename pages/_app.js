import NextLink from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import '../styles/globals.css';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

function NavBar() {
	return (
		<nav
			className='
        w-full p-3
        flex justify-start items-baseline
        bg-gradient-to-b from-stone-400 via-stone-100 to-white
      '
		>
			<NextLink href='/'>
				{/* <Image
					className='p-1.5'
					src='/mef.png'
					alt='MEF University Logo'
					width={100}
					height={64}
					priority
				/> */}
				<span className='border-[#ffd700] border-solid border-0 hover:border-b-4 text-3xl font-semibold drop-shadow-lg transition-all select-none'>
					MEF MOOC Platform
				</span>
			</NextLink>

			<NextLink href='/contributors'>
				<span className='ml-8 border-[#ffd700] border-solid border-0 hover:border-b-4 text-2xl font-medium drop-shadow-lg transition-all select-none'>
					Contributors
				</span>
			</NextLink>

			<NextLink href='/student/courses'>
				<span className='ml-8 border-[#ffd700] border-solid border-0 hover:border-b-4 text-2xl font-medium drop-shadow-lg transition-all select-none'>
					Courses
				</span>
			</NextLink>

			<NextLink href='/student/moocs'>
				<span className='ml-8 border-[#ffd700] border-solid border-0 hover:border-b-4 text-2xl font-medium drop-shadow-lg transition-all select-none'>
					MOOC List
				</span>
			</NextLink>
		</nav>
	);
}

export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>MOOC Platform</title>
				<meta name='description' content='MOOC Platform for MEF University' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div
				className={
					inter.className +
					' min-h-screen selection:bg-purple-600 selection:text-white'
				}
			>
				<NavBar />

				<section className='mx-4'>
					<Component {...pageProps} />
				</section>

				{/* <footer className='w-full p-2'>Kerem yaptı.</footer> */}
			</div>
		</>
	);
}
