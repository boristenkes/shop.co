import Navbar from '@/components/navbar'
import Brands from './_components/brands'
import Hero from './_components/hero'

export default function Home() {
	return (
		<>
			<div className='min-h-[100dvh] flex flex-col'>
				<Navbar />
				<Hero />
			</div>

			<Brands />
		</>
	)
}
