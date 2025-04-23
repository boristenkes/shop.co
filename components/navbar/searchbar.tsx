'use client'

import ErrorMessage from '@/components/error-message'
import { Rating } from '@/components/rating'
import { Input } from '@/components/ui/input'
import { searchProducts } from '@/features/product/actions/read'
import useDebounce from '@/hooks/use-debounce'
import { calculatePriceWithDiscount, cn, formatPrice } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Loader2Icon, SearchIcon } from 'lucide-react'
import Form from 'next/form'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Searchbar() {
	const [expanded, setExpanded] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, 250)
	const isEnabled = !!debouncedSearchTerm
	const query = useQuery({
		queryKey: ['product:search', debouncedSearchTerm],
		queryFn: () => searchProducts(debouncedSearchTerm, { limit: 4 }),
		enabled: isEnabled
	})

	return (
		<div className='relative'>
			<Form
				action='/search'
				className='relative max-w-96'
			>
				<SearchIcon
					className={cn(
						'absolute left-3 top-1/2 -translate-y-1/2 transition-[width,height]',
						expanded ? 'size-5' : 'size-6'
					)}
				/>
				<Input
					className={cn(
						'inline-block pl-10 text-lg bg-neutral-100 transition-[opacity,width]',
						expanded ? 'w-96' : 'w-8 opacity-0 px-0 cursor-pointer'
					)}
					onFocus={() => setExpanded(true)}
					onBlur={() => setTimeout(() => setExpanded(false), 100)}
					onChange={e => setSearchTerm(e.target.value)}
					value={searchTerm}
					name='query'
					type='search'
				/>
			</Form>

			{isEnabled && expanded && (
				<div className='bg-neutral-100 rounded-lg absolute inset-x-0 top-12 shadow-md p-2'>
					{query.isLoading && (
						<Loader2Icon className='animate-spin mx-auto my-8' />
					)}

					{query.data && !query.data.success && (
						<ErrorMessage message='Something went wrong.' />
					)}

					{query.data &&
						query.data.success &&
						(query.data.products.length > 0 ? (
							<div>
								<ul className='space-y-2'>
									{query.data.products.map(product => (
										<li
											key={product.id}
											className='flex gap-2'
										>
											<Link
												href={`/products/${product.slug}/${product.id}`}
												className='bg-[#f0eeed] size-24 rounded-lg p-1'
											>
												<Image
													src={product.images[0].url}
													alt={product.name}
													width={96}
													height={96}
													className='object-contain size-full group-hover:scale-105 transition-transform'
												/>
											</Link>
											<div className='grow space-y-1'>
												<Link href={`/products/${product.slug}/${product.id}`}>
													<h2 className='text-lg font-semibold'>
														{product.name}
													</h2>
												</Link>
												<Rating rating={product.averageRating} />
												<div className='font-bold'>
													{!product.discount || product.discount === 0 ? (
														formatPrice(product.priceInCents)
													) : (
														<div className='flex items-center space-x-3'>
															<div>
																{formatPrice(
																	calculatePriceWithDiscount(
																		product.priceInCents,
																		product.discount
																	)
																)}
															</div>
															<s className='text-gray-400 [text-decoration:line-through]'>
																{formatPrice(product.priceInCents)}
															</s>
															<small className='text-sm py-1.5 px-3 rounded-full bg-red-500/10 text-red-500'>
																&minus;{product.discount}%
															</small>
														</div>
													)}
												</div>
											</div>
										</li>
									))}
								</ul>
								<Link
									href={`/search?query=${encodeURI(debouncedSearchTerm)}`}
									className='mx-auto my-2 font-medium text-blue-500 hover:text-blue-400 block w-fit'
								>
									See all results
								</Link>
							</div>
						) : (
							<p className='text-center py-8'>No products match this query</p>
						))}
				</div>
			)}
		</div>
	)
}
