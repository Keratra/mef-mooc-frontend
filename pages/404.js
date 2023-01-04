import { useRouter } from 'next/router';

export default function Fourofour() {
	const Router = useRouter();

	const handleReturn = async () => {
		Router.replace('/');
	};
	return (
		<>
			<div>
				<div className='h-[90vh] font-sans font-bold text-3xl drop-shadow-2xl flex justify-center items-center text-[#161516]'>
					<div className='w-[2rem] h-[2rem] bg-rose-900 rounded-md mr-4 animate-bounce'></div>
					<span className=''>404 | Not Found</span>
					<div className='w-[2rem] h-[2rem] bg-rose-900 rounded-md ml-4 animate-bounce'></div>
				</div>
				<div
					className='font-sans m-4 cursor-pointer text-blue-700 text-lg'
					onClick={handleReturn}
				>
					Click here to return...
				</div>
			</div>
		</>
	);
}

{
}
