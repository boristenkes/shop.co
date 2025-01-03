import Navbar from '@/components/navbar'
import { Suspense } from 'react'
import Brands from '../_components/brands'
import FeaturedProducts, {
	FeaturedProductsSkeleton
} from '../_components/featured-products'
import Hero from '../_components/hero'
import NewArrivals, { NewArrivalsSkeleton } from '../_components/new-arrivals'

export default function Home() {
	return (
		<>
			<div className='min-h-[100dvh] flex flex-col'>
				<Navbar />
				<Hero />
			</div>

			<Brands />

			<Suspense fallback={<NewArrivalsSkeleton />}>
				<NewArrivals />
			</Suspense>

			<Suspense fallback={<FeaturedProductsSkeleton />}>
				<FeaturedProducts />
			</Suspense>
		</>
	)
}
