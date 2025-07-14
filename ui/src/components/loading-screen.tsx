/** @format */

function LoadingScreen({ message }: { message?: string }) {
	return (
		<div className='flex h-screen justify-center'>
			<div className='flex flex-col justify-center'>
				<div className='w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto'></div>
				<h2 className='text-zinc-900 dark:text-white font-bold text-lg mt-4'>Loading...</h2>
				<p className='text-zinc-600 dark:text-zinc-400'>{message}</p>
			</div>
		</div>
	);
}

export default LoadingScreen;
