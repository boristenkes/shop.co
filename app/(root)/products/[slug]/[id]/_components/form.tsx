'use client'

import ErrorMessage from '@/components/error-message'
import NumberInput from '@/components/number-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { queryClient } from '@/components/utils/providers'
import { SessionCartProduct, useCart } from '@/context/cart'
import { Color } from '@/db/schema/colors'
import { TSize } from '@/db/schema/enums'
import { NewItemData, saveToCart } from '@/features/cart/actions/create'
import { calculatePriceWithDiscount } from '@/lib/utils'
import { darkenHex } from '@/utils/helpers'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, ShoppingCartIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type ProductPageFormProps = {
	colors: Color[]
	sizes: TSize[]
	stock: number
	product: SessionCartProduct
}

export default function ProductPageForm({
	colors,
	sizes,
	stock,
	product
}: ProductPageFormProps) {
	const params = useSearchParams()
	const session = useSession()
	const cart = useCart()
	const defaultColor = colors.find(c => c.slug === params.get('color')) ?? null
	const defaultSize = sizes.includes(params.get('size') as TSize)
		? (params.get('size') as TSize)
		: null
	const [color, setColor] = useState<Color | null>(defaultColor)
	const [size, setSize] = useState<TSize | null>(defaultSize)
	const [quantity, setQuantity] = useState(1)
	const [error, setError] = useState<string | null>(null)
	const mutation = useMutation({
		mutationKey: ['cart:create'],
		mutationFn: (data: NewItemData) => saveToCart(data),
		onSettled(data) {
			if (data?.success) {
				toast.success('Successfully added to cart')
				setError(null)
				queryClient.invalidateQueries({
					queryKey: ['cart:get:own']
				})
			} else {
				setError('Failed to add to cart.')
			}
		}
	})

	useEffect(() => {
		// Persist color and size in URL search params
		const searchParams = new URLSearchParams(params)

		if (color)
			searchParams.set(
				'color',
				colors.find(c => c.id === color.id)?.slug as string
			)
		else searchParams.delete('color')

		if (size) searchParams.set('size', size)
		else searchParams.delete('size')

		history.replaceState(null, '', `?${searchParams.toString()}`)
	}, [color, size, colors, params])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!color || !size) return

		try {
			if (session.status === 'authenticated') {
				mutation.mutate({
					size,
					quantity,
					colorId: color.id,
					productId: product.id,
					productPriceInCents: calculatePriceWithDiscount(
						product.priceInCents,
						product.discount ?? 0
					)
				})
			} else {
				cart.add({ product, color, quantity, size }) // Use local cart context
				toast.success('Product added to the cart')
			}
		} catch (error: any) {
			toast.error(error.message)
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<div className='flex gap-10 items-start pb-6 border-b'>
				<div className='space-y-4'>
					<Label className='text-base font-normal text-stone-700'>
						Choose color
					</Label>
					<RadioGroup
						className='flex items-center gap-2 flex-wrap'
						onValueChange={value =>
							setColor(colors.find(c => c.id === Number(value)) as Color)
						}
						defaultValue={color?.id.toString()}
					>
						{colors.map(color => (
							<RadioGroupItem
								key={color.slug}
								value={color.id.toString()}
								className='size-8 border-2'
								style={{
									backgroundColor: color.hexCode,
									borderColor: darkenHex(color.hexCode)
								}}
								aria-label={color.name}
								disabled={mutation.isPending}
							/>
						))}
					</RadioGroup>
				</div>

				<div className='space-y-4'>
					<Label className='text-base font-normal text-stone-700'>
						Choose size
					</Label>
					<div className='flex flex-wrap gap-2'>
						{sizes.map(s => (
							<Button
								key={s}
								type='button'
								variant={size === s ? 'default' : 'outline'}
								onClick={() => setSize(s)}
								disabled={mutation.isPending}
							>
								{s}
							</Button>
						))}
					</div>
				</div>
			</div>

			{error && <ErrorMessage message={error} />}

			<div className='flex items-center gap-5 mt-6 flex-wrap'>
				<Label
					className='sr-only'
					htmlFor={`numberinput:${product.id}`}
				>
					Quantity (max {Math.min(stock, 20)})
				</Label>
				<NumberInput
					value={quantity}
					onChange={setQuantity}
					min={1}
					max={Math.min(stock, 20)}
					step={1}
					disabled={mutation.isPending}
					id={`numberinput:${product.id}`}
				/>

				<Button
					size='lg'
					className='grow'
					disabled={mutation.isPending || !color || !size}
				>
					{mutation.isPending ? (
						<Loader2Icon className='animate-spin' />
					) : (
						<ShoppingCartIcon />
					)}
					{mutation.isPending ? 'Adding to cart' : 'Add to cart'}
				</Button>
			</div>
		</form>
	)
}
