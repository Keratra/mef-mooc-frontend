import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Tabs({
	selectedTabs,
	setSelectedTabs,
	tabs,
	children,
	fullWidth = true,
}) {
	return (
		<section
			className={
				(fullWidth ? 'w-full max-w-7xl' : 'w-[95%]') +
				' px-2 pb-8 sm:px-0 font-sans transition-all '
			}
		>
			<div className='flex space-x-1 rounded-xl bg-zinc-200/[0.8]  p-1'>
				{!!tabs &&
					tabs.map((tab, idx) => (
						<div
							key={idx}
							onClick={() => setSelectedTabs(idx)}
							className={`
							w-full rounded-lg py-2.5 text-lg
							font-semibold leading-5 text-zinc-700 text-center
							border-0 cursor-pointer 
							ring-opacity-60 ring-white  ring-offset-2 ring-offset-zinc-400 
							focus:outline-none focus:ring-2 transition-colors 
							${
								selectedTabs === idx
									? 'bg-white text-zinc-900 shadow'
									: 'text-zinc-400 bg-white/[0.35] hover:bg-white hover:text-black'
							}
						`}
						>
							<span className='drop-shadow-md select-none '>{tab?.name}</span>
							{!!tab?.amount && (
								<span className='select-none text-sm bg-orange-400/[0.8] ml-2 px-2 py-0.5 rounded-full font-semibold drop-shadow-md'>
									{tab?.amount}
									<span className='select-none font-normal ml-1'>
										submissions waiting
									</span>
								</span>
							)}
						</div>
					))}
				{children}
			</div>
		</section>
	);
}
