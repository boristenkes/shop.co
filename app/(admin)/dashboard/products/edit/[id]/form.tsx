'use client'

import ErrorMessage from '@/components/error-message'
import { ImageDropzone } from '@/components/image-dropzone'
import RichTextEditor from '@/components/rich-text-editor'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { GetCategoriesReturn } from '@/features/category/actions/read'
import { GetColorsReturn } from '@/features/color/actions/read'
import { GetProductByIdProduct } from '@/features/product/actions/read'
import { updateProduct } from '@/features/product/actions/update'
import {
	type EditProductSchema,
	editProductSchema
} from '@/features/product/zod'
import { Size, sizes } from '@/lib/enums'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { darkenHex, getUploadthingKey, isEmpty } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ClientUploadedFileData } from 'uploadthing/types'
import NewCategoryButton from '../../../categories/components'
import NewColorButton from '../../../colors/components'

type EditProductFormProps = {
	product: GetProductByIdProduct
	getCategoriesResponse: GetCategoriesReturn
	getColorsResponse: GetColorsReturn
}

export function EditProductForm({
	product,
	getCategoriesResponse,
	getColorsResponse
}: EditProductFormProps) {
	const form = useForm<EditProductSchema>({
		resolver: zodResolver(editProductSchema),
		defaultValues: {
			name: product.name,
			description: product.description ?? '',
			detailsHTML: product.detailsHTML ?? undefined,
			price: product.priceInCents / 100,
			discount: product.discount ?? 0,
			stock: product.stock ?? 0,
			sizes: product.sizes as Size[],
			colors: product.productsToColors.map(({ color }) => color.id),
			archived: product.archived ?? false,
			featured: product.featured ?? false,
			category: product.categoryId ?? undefined
		}
	})
	const [files, setFiles] = useState<(File | string)[]>(
		product.images.map(image => image.url)
	)
	const { isUploading, startUpload } = useUploadThing('imageUploader')
	const { errors, isSubmitting, isDirty } = form.formState

	const onSubmit = useCallback(
		async (data: EditProductSchema) => {
			try {
				if (!files.length) throw new Error('At least one image is required.')
				if (files.length > 10) throw new Error('Maximum 10 images are allowed.')

				const dirtyFields = Object.keys(form.formState.dirtyFields)
				type DataKey = keyof typeof data

				const dirtyValues = Object.fromEntries(
					dirtyFields.map(key => [key, data[key as DataKey]])
				) as EditProductSchema

				let newImages

				const hasUpdatedImages =
					files.length !== product.images.length ||
					files.some(file => file instanceof File)
				const hasDirtyFields = !isEmpty(dirtyValues)

				if (!hasUpdatedImages && !hasDirtyFields) return

				if (files.length !== product.images.length || hasUpdatedImages) {
					let uploadedImages: ClientUploadedFileData<null>[] | undefined = []

					if (hasUpdatedImages) {
						uploadedImages = await startUpload(
							files.filter(file => file instanceof File)
						)

						if (!uploadedImages) throw new Error('Failed to upload images.')
					}

					let idx = 0
					newImages = files.map(file =>
						file instanceof File
							? { url: uploadedImages[idx].url, key: uploadedImages[idx++].key }
							: { url: file, key: getUploadthingKey(file) }
					)
				}

				const response = await updateProduct(product.id, dirtyValues, newImages)

				if (!response.success) throw new Error(response.message)

				toast.success('Product edited successfully')
			} catch (error: any) {
				form.setError('root', { message: error.message })
				window.scrollTo({ top: 0, behavior: 'smooth' })
			}
		},
		[files, form, product, startUpload]
	)

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8'
			>
				{errors.root && <ErrorMessage message={errors.root.message!} />}

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										disabled={isSubmitting}
										{...field}
									/>
								</FormControl>
								<FormDescription>Enter product name</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='price'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Price ($)</FormLabel>
								<FormControl>
									<Input
										type='number'
										step='0.01'
										disabled={isSubmitting}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter product price in US dollars
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='discount'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Discount (%) (Optional)</FormLabel>
								<FormControl>
									<Input
										type='number'
										step={5}
										min={0}
										max={100}
										disabled={isSubmitting}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter discount percentage (0-100)
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='stock'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Stock</FormLabel>
								<FormControl>
									<Input
										type='number'
										disabled={isSubmitting}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter the quantity of this product you have in stock
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem className='col-span-full'>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										disabled={isSubmitting}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter brief description of the product
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='sizes'
						render={({ field }) => (
							<FormItem className='col-span-full md:col-span-1'>
								<FormLabel>Available Sizes</FormLabel>
								<FormControl>
									<div className='flex flex-wrap gap-2'>
										{sizes.map(size => (
											<Button
												key={size}
												type='button'
												disabled={
													isSubmitting || !getCategoriesResponse.success
												}
												variant={
													(field.value as Size[]).includes(size)
														? 'default'
														: 'outline'
												}
												onClick={() => {
													const value = field.value as Size[]
													const updatedSizes = value.includes(size)
														? value.filter(s => s !== size)
														: [...value, size]
													field.onChange(updatedSizes)
												}}
											>
												{size}
											</Button>
										))}
									</div>
								</FormControl>
								<FormDescription>
									Select available sizes for this product
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='colors'
						render={({ field }) => (
							<FormItem className='col-span-full md:col-span-1'>
								<FormLabel>Available Colors</FormLabel>
								<FormControl>
									<div className='flex flex-wrap gap-2'>
										{getColorsResponse.success &&
											getColorsResponse.colors.map(color => (
												<Button
													key={color.id}
													type='button'
													disabled={isSubmitting || !getColorsResponse.success}
													variant={
														(field.value as number[]).includes(color.id)
															? 'default'
															: 'outline'
													}
													onClick={() => {
														const value = field.value as number[]
														const updatedColors = value.includes(color.id)
															? value.filter(s => s !== color.id)
															: [...value, color.id]
														field.onChange(updatedColors)
													}}
												>
													<div
														className='size-4 rounded-sm'
														style={{
															backgroundColor: color.hexCode,
															borderColor: darkenHex(color.hexCode)
														}}
													/>{' '}
													{color.name}
												</Button>
											))}
										<NewColorButton
											type='button'
											disabled={isSubmitting || !getColorsResponse.success}
											variant='outline'
										>
											<PlusIcon /> Add new
										</NewColorButton>
									</div>
								</FormControl>
								<FormDescription>
									Enter available colors for this product{' '}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='category'
						render={({ field }) => (
							<FormItem
								className={cn('col-span-full', {
									'opacity-50': !getCategoriesResponse.success
								})}
							>
								<FormLabel>Category</FormLabel>
								<Select
									onValueChange={field.onChange}
									disabled={!getCategoriesResponse.success || isSubmitting}
									defaultValue={product.categoryId?.toString()}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select a category' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{getCategoriesResponse.success &&
											getCategoriesResponse.categories.map(category => (
												<SelectItem
													key={category.id}
													value={category.id.toString()}
												>
													{category.name}
												</SelectItem>
											))}
										<NewCategoryButton
											className='flex items-center justify-start gap-2 text-sm py-1.5 pl-8 pr-2 w-full rounded-sm'
											variant='ghost'
										>
											Add new
											<PlusIcon className='size-4' />
										</NewCategoryButton>
									</SelectContent>
								</Select>
								<FormDescription>
									Assign a category to this product
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='archived'
						render={({ field }) => (
							<FormItem className='rounded-md border p-4 flex flex-row items-start space-x-3 space-y-0 col-span-full md:col-span-1'>
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
										This product will not appear to customers.
									</FormDescription>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='featured'
						render={({ field }) => (
							<FormItem className='rounded-md border p-4 flex flex-row items-start space-x-3 space-y-0 col-span-full md:col-span-1'>
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
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='detailsHTML'
						render={({ field }) => (
							<FormItem className='rounded-md space-y-2 col-span-full'>
								<div className='space-y-2 leading-none'>
									<FormLabel>Details (optional)</FormLabel>
									<FormControl>
										<RichTextEditor
											onChange={field.onChange}
											disabled={isSubmitting}
											defaultValue={field.value}
										/>
									</FormControl>
									<FormDescription>
										Enter additional details about the product, such as
										material, care instructions, or any other relevant
										information.
									</FormDescription>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<div>
						<FormLabel htmlFor='image-input'>Upload images</FormLabel>
						<ImageDropzone
							id='image-input'
							value={files}
							dropzoneOptions={{
								maxFiles: 10,
								maxSize: 1024 * 1024 * 4 // 4MB
							}}
							onChange={files => setFiles(files)}
							onFilesAdded={async addedFiles =>
								setFiles([...files, ...addedFiles])
							}
							disabled={isSubmitting}
						/>
						<FormDescription className='text-pretty'>
							Upload up to 10 images directly from your computer or by
							drag-and-dropping. To ensure the best results, optimize your
							images before uploading:
						</FormDescription>
						<ul className='list-disc ml-4 mt-2 text-sm text-zinc-500'>
							<li>Resize to have the same width and height</li>
							<li>Use web-friendly foramts like .webp</li>
							<li>
								Compress the file size using online tools without losing on
								quality
							</li>
						</ul>
					</div>
				</div>

				<Button
					type='submit'
					disabled={
						isSubmitting ||
						(!isDirty &&
							files.every(file => typeof file === 'string') &&
							files.length === product.images.length)
					}
					className='ml-auto flex items-center gap-2'
				>
					{isSubmitting && <Loader2Icon className='animate-spin' />}
					{isUploading
						? 'Uploading images'
						: isSubmitting
						? 'Saving changes'
						: 'Save changes'}
				</Button>
			</form>
		</Form>
	)
}
