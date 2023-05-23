import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { notify } from 'utils/notify';
import Modal from '@components/Modal';

export default function Home() {
	const [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	/*
	notify(
		'error',
		error?.response?.data?.message?.message ??
			error?.response?.data?.message ??
			error?.message
	);
	*/

	const classButton = `
		text-center text-xl text-white 
		py-2 px-4 font-bold
		bg-[#212021] hover:bg-[#303030] 
		shadow-md rounded-xl border-none
		ring-2 ring-offset-0 ring-[#212021]
		hover:ring-4 hover:ring-offset-4 hover:ring-[#303030]
		cursor-pointer transition-all
	`;

	return (
		<div className='min-h-[80vh] flex flex-col justify-center items-center'>
			<Modal
				{...{ isOpen, setIsOpen, closeModal, openModal }}
				title='Test test test.'
			>
				<div className='mt-2'>
					<p className='text-sm text-gray-500'>
						Your payment has been successfully submitted. We’ve sent you an
						email with all of the details of your order.
					</p>
				</div>
			</Modal>
			<h1 className='text-center text-5xl mb-4 drop-shadow-md'>
				Hello MEF Member!
			</h1>
			<span className='text-center text-3xl mb-8 drop-shadow-md'>
				Please login to your account.
			</span>

			<section className='mx-auto grid grid-cols-3 gap-8'>
				<NextLink href='/coordinator/auth/login' className={classButton}>
					As a Coordinator
				</NextLink>

				<NextLink href='/student/auth/login' className={classButton}>
					As a Student
				</NextLink>

				<NextLink href='/admin/auth/login' className={classButton}>
					As an Administrator
				</NextLink>
			</section>
		</div>
	);
}
