'use client'

import ErrorMessage from '@/components/error-message'
import NumberInput from '@/components/number-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SessionCartProduct, useCart } from '@/context/cart'
import { Color } from '@/db/schema/colors'
import { TSize } from '@/db/schema/enums'
import { NewItemData, saveToCart } from '@/features/cart/actions'
import { darkenHex } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, ShoppingCartIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type ProductPageFormProps = {
	colors: Color[]
	sizes: TSize[]
	stock: number
	currentUserId: number | undefined
	product: SessionCartProduct
}

export default function ProductPageForm({
	colors,
	sizes,
	stock,
	currentUserId,
	product
}: ProductPageFormProps) {
	const params = useSearchParams()
	const { sessionCartItems, addToCart } = useCart()
	const [color, setColor] = useState<Color | null>(
		colors.find(c => c.slug === params.get('color')) ?? null
	)
	const [size, setSize] = useState<TSize | null>(
		sizes.includes(params.get('size') as TSize)
			? (params.get('size') as TSize)
			: null
	)
	const [quantity, setQuantity] = useState(1)
	const mutation = useMutation({
		mutationKey: ['cart:create'],
		mutationFn: async (data: NewItemData) => saveToCart(data),
		onSettled(data) {
			if (data?.success) {
				toast.success('Added to cart')
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
			if (currentUserId) {
				mutation.mutate({
					size,
					quantity,
					colorId: color.id,
					productId: product.id
				})
			} else {
				const isAlreadyInCart = sessionCartItems.some(
					item =>
						item.product.id === product.id &&
						item.color.id === color.id &&
						item.size === size
				)

				if (isAlreadyInCart)
					throw new Error(
						'This product with same color and size is already in the cart.'
					)

				addToCart({ product, color, quantity, size }) // Use local cart context
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
								disabled={mutation.isPending}
							/>
						))}
					</RadioGroup>
				</div>

				<div className='space-y-4'>
					<Label className='text-base font-normal text-stone-700'>
						Choose Size
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

			{mutation.data && !mutation.data.success && (
				<ErrorMessage message={mutation.data.message} />
			)}

			<div className='flex items-center gap-5 mt-6 flex-wrap'>
				<Label className='sr-only'>Quantity (max {Math.min(stock, 20)})</Label>
				<NumberInput
					value={quantity}
					onChange={setQuantity}
					min={1}
					max={Math.min(stock, 20)}
					step={1}
					disabled={mutation.isPending}
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
