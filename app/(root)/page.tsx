import Navbar from '@/components/navbar'
import Brands from '../_components/brands'
import FeaturedProducts from '../_components/featured-products'
import Hero from '../_components/hero'
import NewArrivals from '../_components/new-arrivals'

export default function Home() {
	return (
		<>
			<div className='min-h-[100dvh] flex flex-col'>
				<Navbar />
				<Hero />
			</div>
			<Brands />
			<NewArrivals />
			<FeaturedProducts />
		</>
	)
}
