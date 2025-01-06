'use client'

import ErrorMessage from '@/components/error-message'
import NumberInput from '@/components/number-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCart } from '@/context/cart'
import { Color } from '@/db/schema/colors.schema'
import { Size, TSize } from '@/db/schema/enums'
import { NewItemData, saveToCart } from '@/features/cart/actions'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon, ShoppingCartIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

type ProductPageFormProps = {
	colors: Color[]
	sizes: TSize[]
	stock: number
	currentUserId: number | undefined
	productId: number
}

export default function ProductPageForm({
	colors,
	sizes,
	stock,
	currentUserId,
	productId
}: ProductPageFormProps) {
	const params = useSearchParams()
	const { addToCart } = useCart()
	const [colorId, setColorId] = useState<number | null>(
		colors.find(c => c.slug === params.get('color'))?.id ?? null
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

		if (colorId)
			searchParams.set(
				'color',
				colors.find(c => c.id === colorId)?.slug as string
			)
		else searchParams.delete('color')

		if (size) searchParams.set('size', size)
		else searchParams.delete('size')

		history.replaceState(null, '', `?${searchParams.toString()}`)
	}, [colorId, size])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const productPageFormSchema = z.object({
			colorId: z.coerce
				.number()
				.int()
				.positive()
				.finite()
				.refine(colorId => colors.some(c => c.id === colorId)), // Must be included in `colors`
			size: z.nativeEnum(Size).refine(size => sizes.includes(size)), // must be included in `sizes`
			quantity: z.coerce.number().int().positive().lte(Math.min(stock, 20))
		})

		try {
			const parsed = productPageFormSchema.parse({ colorId, size, quantity })

			if (currentUserId) {
				mutation.mutate({ ...parsed, productId })
			} else {
				addToCart({ ...parsed, productId }) // Use local cart context
			}
		} catch (error) {
			console.error(error)
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
						onValueChange={value => setColorId(Number(value))}
						defaultValue={colorId?.toString()}
					>
						{colors.map(color => (
							<RadioGroupItem
								key={color.slug}
								value={color.id.toString()}
								className='size-8'
								style={{ backgroundColor: color.hexCode }}
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

			<div className='flex items-center gap-5 mt-6'>
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
					disabled={mutation.isPending}
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

// 'use client'

// import NumberInput from '@/components/number-input'
// import { Button } from '@/components/ui/button'
// import {
// 	Form,
// 	FormControl,
// 	FormDescription,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage
// } from '@/components/ui/form'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Color } from '@/db/schema/colors.schema'
// import { Size, TSize } from '@/db/schema/enums'
// import { delay } from '@/lib/utils'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useSearchParams } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'

// type ProductPageFormProps = {
// 	colors: Color[]
// 	sizes: TSize[]
// 	stock: number
// }

// export default function ProductPageForm({
// 	colors,
// 	sizes,
// 	stock
// }: ProductPageFormProps) {
// 	const productPageFormSchema = z.object({
// 		color: z.coerce
// 			.number()
// 			.int()
// 			.positive()
// 			.finite()
// 			.refine(colorId => colors.some(c => c.id === colorId)), // Must be included in `colors`
// 		size: z.nativeEnum(Size).refine(size => sizes.includes(size)), // must be included in `sizes`
// 		quantity: z.coerce.number().int().positive().lte(stock)
// 	})
// 	const searchParams = useSearchParams()
// 	const form = useForm<z.infer<typeof productPageFormSchema>>({
// 		defaultValues: {
// 			color: colors.find(c => c.slug === searchParams.get('color'))?.id,
// 			// size: '',
// 			quantity: 1
// 		},
// 		resolver: zodResolver(productPageFormSchema)
// 	})

// 	const onSubmit = async (data: z.infer<typeof productPageFormSchema>) => {
// 		await delay(2000)
// 		console.log(data)
// 	}

// 	return (
// 		<Form {...form}>
// 			<form onSubmit={form.handleSubmit(onSubmit)}>
// 				<div className='flex items-start gap-8 border-b pb-6'>
// 					<FormField
// 						control={form.control}
// 						name='color'
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormLabel className='text-base font-normal text-stone-700'>
// 									Choose color
// 								</FormLabel>
// 								<FormControl>
// 									<RadioGroup
// 										defaultValue={field.value?.toString()}
// 										onValueChange={field.onChange}
// 										className='flex items-center gap-2 flex-wrap'
// 									>
// 										{colors.map(color => (
// 											<FormItem
// 												key={color.slug}
// 												className='flex items-center space-x-3 space-y-0'
// 											>
// 												<FormControl>
// 													<RadioGroupItem
// 														value={color.id.toString()}
// 														className='size-8'
// 														style={{
// 															backgroundColor: color.hexCode
// 														}}
// 													/>
// 												</FormControl>
// 												<FormLabel className='font-normal sr-only'>
// 													{color.name}
// 												</FormLabel>
// 											</FormItem>
// 										))}
// 									</RadioGroup>
// 								</FormControl>
// 								<FormDescription />
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>

// 					<FormField
// 						control={form.control}
// 						name='size'
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormLabel className='text-base font-normal text-stone-700'>
// 									Choose Size
// 								</FormLabel>
// 								<FormControl>
// 									<div className='flex flex-wrap gap-2'>
// 										{sizes.map(size => (
// 											<Button
// 												key={size}
// 												type='button'
// 												variant={field.value === size ? 'default' : 'outline'}
// 												onClick={() => {
// 													// new URLSearchParams(searchParams).set('size', size)
// 													history.replaceState(null, '', `?size=${size}`)
// 													field.onChange(size)
// 												}}
// 											>
// 												{size}
// 											</Button>
// 										))}
// 									</div>
// 								</FormControl>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 				</div>

// 				<div className='flex items-center gap-5'>
// 					<FormField
// 						control={form.control}
// 						name='quantity'
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormLabel className='sr-only'>
// 									Quantity (max {stock})
// 								</FormLabel>
// 								<FormControl>
// 									<NumberInput
// 										value={Number(field.value)}
// 										onChange={field.onChange}
// 										min={1}
// 										max={stock}
// 										step={1}
// 									/>
// 								</FormControl>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 					<Button
// 						size='lg'
// 						className='grow'
// 					>
// 						Add to cart
// 					</Button>
// 				</div>
// 			</form>
// 		</Form>
// 	)
// }
