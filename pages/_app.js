import NextLink from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import '../styles/globals.css';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { AuthProvider } from 'contexts/auth/AuthProvider';
import { AppProvider } from 'contexts/AppContext';
import { useAuth } from 'contexts/auth/AuthProvider';
import { useApp } from 'contexts/AppContext';
import RouteGuard from '@components/RouteGuard';
import { chooseUserType, loadState, parseJwt } from 'lib';
import { FiMenu, FiLogOut, FiArrowRight } from 'react-icons/fi';
import { USER_TYPES } from 'utils/constants';

const inter = Inter({ subsets: ['latin'] });

function NavBar({ items }) {
	const { state, logout } = useAuth();
	const appState = useApp();

	return (
		<nav
			className='
        w-full p-3
        flex justify-start items-baseline
        bg-gradient-to-b from-[#eee] via-slate-100 to-white
      '
		>
			<NextLink href='/'>
				<span className='border-[#ffd700] border-solid border-0 hover:border-b-4 text-3xl font-semibold drop-shadow-lg transition-all select-none'>
					MEF MOOC Platform
				</span>
			</NextLink>

			<NextLink href='/contributors'>
				<span className='ml-8 border-[#ffd700] border-solid border-0 hover:border-b-4 text-2xl font-medium drop-shadow-lg transition-all select-none'>
					Contributors
				</span>
			</NextLink>

			<span>
				{!!items &&
					items.map(({ name, pathname, icon }) => (
						<NextLink key={name} href={pathname}>
							<span className='ml-8 border-[#ffd700] border-solid border-0 hover:border-b-4 text-2xl font-medium drop-shadow-lg transition-all select-none'>
								{icon} {name}
							</span>
						</NextLink>
					))}
			</span>

			{state?.isAuthenticated && (
				<NextLink
					onClick={USER_TYPES.includes(appState.userType) && logout}
					href='/'
				>
					<span className='ml-8 text-2xl font-medium drop-shadow-lg transition-all select-none'>
						<FiLogOut
							size={22}
							className={`rotate-180 inline-block align-middle text-red-700 hover:text-red-500 transition-colors`}
						/>
					</span>
				</NextLink>
			)}
		</nav>
	);
}

export default function App({ Component, pageProps }) {
	const Router = useRouter();
	const currentPage = Router.pathname;

	const tokenState = loadState('token');

	const tokenDetails = parseJwt(tokenState?.token);
	const userType = tokenDetails?.sub.type;
	const items = chooseUserType(tokenDetails?.sub.type);

	const navbarTitle = tokenState?.userName;

	return (
		<>
			<Head>
				<title>MOOC Platform</title>
				<meta name='description' content='MOOC Platform for MEF University' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<AppProvider>
				<AuthProvider>
					<RouteGuard>
						<div
							className={
								inter.className +
								' min-h-screen selection:bg-purple-600 selection:text-white'
							}
						>
							<NavBar items={items} />

							<section className='mx-4'>
								<Component {...pageProps} />
							</section>

							{/* <footer className='w-full p-2'>Kerem yaptı.</footer> */}
						</div>
					</RouteGuard>
				</AuthProvider>
			</AppProvider>
		</>
	);
}
