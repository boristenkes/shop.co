'use client'

import ErrorMessage from '@/components/error-message'
import { FileState, ImageDropzone } from '@/components/image-dropzone'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createProduct, updateProduct } from '@/features/product/actions'
import {
	type NewProductSchema,
	newProductSchema
} from '@/features/product/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Product } from '@prisma/client'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type EditFormProps = { isEdit: true; product: Product }
type CreateFormProps = { isEdit: false }

type Props = { categories: Category[] } & (CreateFormProps | EditFormProps)

export default function ProductForm(props: Props) {
	const [fileStates, setFileStates] = useState<FileState[]>(
		props.isEdit
			? props.product.images.map(image => ({
					file: image.url,
					key: image.key
			  }))
			: []
	)
	const form = useForm({
		resolver: zodResolver(newProductSchema),
		// @ts-expect-error
		defaultValues: getDefaultValues(props.isEdit, props.product)
	})
	const router = useRouter()
	const { isSubmitting, isDirty } = form.formState

	const onSubmit = useCallback(async (data: NewProductSchema) => {
		try {
			if (!fileStates?.length) throw new Error('At least one image is required')

			const uploadedFiles = fileStates.map(fileState => fileState.file)

			if (!uploadedFiles) throw new Error('Something went wrong')

			const formData = new FormData()

			uploadedFiles.forEach(file => {
				if (typeof file === 'string') {
					formData.append('images', file)
				} else {
					formData.append('images', file, file.name)
				}
			})

			const response = await (props.isEdit
				? updateProduct(props.product.id, data, formData)
				: createProduct(data, formData))

			if (!response.success) throw new Error(response.message)

			toast.success(response.message)

			if (props.isEdit) router.push('/dashboard/products')

			form.reset()
			setFileStates([])
		} catch (error: any) {
			console.error('[SUBMIT_ERROR]:', error)
			form.setError('root', { message: error.message })
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [])

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid gap-6'
			>
				{form.formState.errors.root?.message && (
					<ErrorMessage message={form.formState.errors.root?.message} />
				)}

				<FormField
					control={form.control}
					name='name'
					disabled={isSubmitting}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									disabled={isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is first thing customers see, so make it count!
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='description'
					disabled={isSubmitting}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									disabled={isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Tell customers a bit more about this product. Make it sound
								engaging and informative.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex items-center gap-x-16 gap-y-6 flex-wrap'>
					<FormField
						control={form.control}
						name='price'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<span>$</span>
										<Input
											type='number'
											className='max-w-20'
											step={0.01}
											min={0}
											max={99999}
											disabled={isSubmitting}
											{...field}
											onChange={e => field.onChange(e.target.valueAsNumber)}
										/>
									</div>
								</FormControl>
								<FormDescription>
									Price of the product in US dollars.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='stock'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Stock</FormLabel>
								<FormControl>
									<Input
										type='number'
										step={1}
										className='max-w-20'
										min={1}
										disabled={isSubmitting}
										{...field}
										onChange={e => field.onChange(e.target.valueAsNumber)}
									/>
								</FormControl>
								<FormDescription>
									How many products do you currently have in stock?
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='discount'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Discount (optional)</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<span>%</span>
										<Input
											type='number'
											step={5}
											className='max-w-20'
											min={0}
											max={100}
											disabled={isSubmitting}
											{...field}
											onChange={e => field.onChange(e.target.valueAsNumber)}
										/>
									</div>
								</FormControl>
								<FormDescription>Discount for this product.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='flex items-center gap-x-16 gap-y-6 flex-wrap'>
					{props.categories ? (
						<FormField
							control={form.control}
							name='categories'
							render={() => (
								<FormItem>
									<div className='mb-4'>
										<FormLabel>Categories</FormLabel>
										<FormDescription>
											Select categories for this product.
										</FormDescription>
									</div>
									{props.categories.map(item => (
										<FormField
											key={item.id}
											control={form.control}
											name='categories'
											render={({ field }) => (
												<FormItem
													key={item.id}
													className='flex flex-row items-center gap-2'
												>
													<FormControl>
														<Checkbox
															{...field}
															// TODO: Check why is field.value `never`
															checked={(field.value as string[])?.includes(
																item.id
															)}
															onCheckedChange={checked => {
																return checked
																	? field.onChange([...field.value, item.id])
																	: field.onChange(
																			field.value?.filter(
																				(value: string) => value !== item.id
																			)
																	  )
															}}
															disabled={form.formState.isSubmitting}
															defaultChecked={
																props.isEdit &&
																props.product.categoryIds.includes(item.id)
															}
														/>
													</FormControl>
													<FormLabel className='font-normal m-0'>
														{item.name}
													</FormLabel>
												</FormItem>
											)}
										/>
									))}
									<FormMessage />
								</FormItem>
							)}
						/>
					) : (
						<ErrorMessage message='Categories unavailable right now. Please try again later.' />
					)}
				</div>

				<div className='flex items-center gap-4 flex-wrap'>
					<FormField
						control={form.control}
						name='featured'
						render={({ field }) => (
							<FormItem className='flex grow items-start space-x-3 space-y-0 rounded-md border p-4'>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSubmitting}
									/>
								</FormControl>
								<div className='space-y-1 leading-none'>
									<FormLabel>Featured</FormLabel>
									<FormDescription>
										This product will appear on home page.
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='archived'
						render={({ field }) => (
							<FormItem className='flex grow items-start space-x-3 space-y-0 rounded-md border p-4'>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSubmitting}
									/>
								</FormControl>
								<div className='space-y-1 leading-none'>
									<FormLabel>Archived</FormLabel>
									<FormDescription>
										This product will not be visible to customers.
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>
				</div>

				<ImageDropzone
					value={fileStates}
					dropzoneOptions={{
						maxFiles: 10,
						maxSize: 1024 * 1024 * 4 // 4MB
					}}
					onChange={files => setFileStates(files)}
					onFilesAdded={async addedFiles =>
						setFileStates([...fileStates, ...addedFiles])
					}
					disabled={isSubmitting}
				/>

				<Button
					className='ml-auto'
					disabled={isSubmitting || (props.isEdit && !isDirty)}
				>
					{isSubmitting && <Loader2Icon className='mr-2 size-4 animate-spin' />}
					{buttonText(props.isEdit, isSubmitting)}
				</Button>
			</form>
		</Form>
	)
}

function buttonText(isEdit: boolean, isSubmitting: boolean) {
	if (isEdit) return isSubmitting ? 'Saving' : 'Save'

	return isSubmitting ? 'Creating' : 'Create'
}

function getDefaultValues(isEdit: boolean, product: any) {
	if (isEdit)
		return {
			...product,
			price: product.priceInCents / 100,
			categories: product.categoryIds
		}

	return {
		name: '',
		description: '',
		price: 0,
		stock: 1,
		discount: 0,
		categories: [],
		featured: false,
		archived: false
	}
}
