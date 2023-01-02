import React from 'react';
import { useRouter } from 'next/router';

export default function Loader() {
	const Router = useRouter();

	const handleReturn = async () => {
		Router.replace('/');
	};

	return (
		<div>
			<div className='h-[92vh] font-sans font-bold text-3xl drop-shadow-2xl flex justify-center items-center text-[#161516]'>
				<div className='w-[2rem] h-[2rem] bg-[#212021] rounded-md mr-4 animate-spin'></div>
				<span className='animate-pulse'>Loading...</span>
			</div>
			<div
				className='font-sans m-4 cursor-pointer text-blue-700 text-lg'
				onClick={handleReturn}
			>
				Click here to return...
			</div>
		</div>
	);
}
