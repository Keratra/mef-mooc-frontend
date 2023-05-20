import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import '../styles/nprogress.css';
import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { AuthProvider } from 'contexts/auth/AuthProvider';
import { AppProvider } from 'contexts/AppContext';
import { useAuth } from 'contexts/auth/AuthProvider';
import { useApp } from 'contexts/AppContext';
import RouteGuard from '@components/RouteGuard';
import { chooseUserType, loadState, parseJwt } from 'lib';
import { FiMenu, FiLogOut, FiArrowRight, FiX } from 'react-icons/fi';
import { USER_TYPES } from 'utils/constants';
import { ToastContainer } from 'react-toastify';
import { HiUsers, HiViewGridAdd } from 'react-icons/hi';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const inter = Inter({ subsets: ['latin'] });

function NavBar({ state, logout, items, open, setOpen }) {
	return (
		<nav
			className='
        w-full p-3
        flex justify-start items-baseline
        bg-gradient-to-b from-zinc-200 via-zinc-100 to-zinc-100
				border-solid border-0 border-b border-zinc-300
      '
		>
			<div
				onClick={() => setOpen(() => !open)}
				className=' mr-4 cursor-pointer text-xl hover:text-zinc-700 font-medium drop-shadow-lg transition-all select-none'
			>
				{open ? (
					<FiMenu size={27} className={`inline-block align-text-bottom`} />
				) : (
					<FiX size={27} className={`inline-block align-text-bottom`} />
				)}
			</div>

			<Link href='/'>
				<span className='border-none text-2xl hover:text-zinc-900/[0.8] font-semibold drop-shadow-lg transition-all select-none'>
					MEF MOOC
				</span>
			</Link>

			<span className='flex-grow'></span>

			{state?.isAuthenticated && (
				<Link onClick={logout} href='/'>
					<span className=' mr-4 text-xl font-medium drop-shadow-lg select-none text-red-700/[0.70] hover:text-red-500 transition-all'>
						Logout{' '}
						<FiLogOut
							size={24}
							className={`inline-block rotate-180 align-text-top`}
						/>
					</span>
				</Link>
			)}
		</nav>
	);
}

function Sidebar({ items, open, setOpen, children }) {
	const { state, logout } = useAuth();

	return (
		<div className=''>
			<NavBar
				state={state}
				logout={logout}
				items={items}
				open={open}
				setOpen={setOpen}
			/>
			<div className='h-[94vh] flex-row lg:flex'>
				<div
					className={` ${
						open ? 'lg:w-0' : 'lg:w-60 '
					}  flex flex-col lg:h-full  w-full bg-zinc-200/[0.75] shadow duration-100 border-solid border-0 border-r border-zinc-300  `}
				>
					<div
						className={`px-3 py-1 space-y-3 h-full ${open ? 'hidden ' : '  '}`}
					>
						<div className='flex-1'>
							<ul className='pt-2 pb-4 space-y-1'>
								<Link href='/contributors'>
									<span className=' flex items-center p-2 space-x-3 rounded-md hover:bg-zinc-100/[0.8] text-xl font-medium drop-shadow-lg select-none transition-colors '>
										<HiUsers size={26} className='align-text-bottom' />{' '}
										<span className='ml-1.5'>Contributors</span>
									</span>
								</Link>

								{state?.isAuthenticated &&
									!!items &&
									items.map(({ name, pathname, icon }) => (
										<Link key={name} href={pathname}>
											<span className=' mt-4 flex items-center p-2 space-x-3 rounded-md hover:bg-zinc-100/[0.8] text-xl font-medium drop-shadow-lg select-none transition-colors '>
												{icon} <span className='ml-1.5'>{name}</span>
											</span>
										</Link>
									))}
							</ul>
						</div>
					</div>
				</div>
				<div className='overflow-y-auto w-full mx-auto '>{children}</div>
			</div>
		</div>
	);
}

export default function App({ Component, pageProps }) {
	const Router = useRouter();
	// const currentPage = Router.pathname;
	const [open, setOpen] = useState(true);

	const tokenState = loadState('token');

	const tokenDetails = parseJwt(tokenState?.token);
	// const userType = tokenDetails?.sub.type;
	const items = chooseUserType(tokenDetails?.sub.type);

	// const navbarTitle = tokenState?.userName;

	// if (currentPage !== '/maintenance' && currentPage !== '/contributors') {
	// 	Router.push('/maintenance');
	// }

	return (
		<>
			<Head>
				<title>MEF MOOC Platform</title>
				<meta name='description' content='MOOC Platform for MEF University' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/mef.jpg' />
			</Head>

			<AppProvider>
				<AuthProvider>
					<RouteGuard>
						<div
							className={
								inter.className +
								' min-h-screen bg-gradient-to-b from-zinc-100/[0.8] to-slate-100 selection:bg-purple-700 selection:text-white'
							}
						>
							<Sidebar items={items} open={open} setOpen={setOpen}>
								<Component {...pageProps} />
							</Sidebar>

							<ToastContainer />
						</div>
					</RouteGuard>
				</AuthProvider>
			</AppProvider>
		</>
	);
}
