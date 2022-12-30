import NextLink from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import '../styles/globals.css';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>MOOC Platform</title>
        <meta name='description' content='MOOC Platform for MEF University' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={inter.className + ' min-h-screen'}>
        <nav
          className='
            w-full px-2'
        >
          <NextLink href='/'>
            <Image
              className='p-1.5'
              src='/mef.png'
              alt='MEF University Logo'
              width={100}
              height={64}
              priority
            />
          </NextLink>
        </nav>

        <section className='mx-4'>
          <Component {...pageProps} />
        </section>

        {/* <footer className='w-full p-2'>Kerem yaptı.</footer> */}
      </div>
    </>
  );
}
