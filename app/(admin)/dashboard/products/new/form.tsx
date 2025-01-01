'use client'

import ErrorMessage from '@/components/error-message'
import { ImageDropzone } from '@/components/image-dropzone'
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
import { Size, TSize } from '@/db/schema/enums'
import { ProductImage } from '@/db/schema/product-images.schema'
import { GetCategoriesReturn } from '@/features/category/actions'
import { GetColorsReturn } from '@/features/color/actions'
import { createProduct } from '@/features/product/actions'
import { newProductSchema } from '@/features/product/zod'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export function NewProductForm({
	getCategoriesResponse,
	getColorsResponse
}: {
	getCategoriesResponse: GetCategoriesReturn
	getColorsResponse: GetColorsReturn
}) {
	const form = useForm({
		resolver: zodResolver(newProductSchema),
		defaultValues: {
			name: '',
			description: '',
			price: 0,
			discount: 0,
			stock: 1,
			sizes: [],
			colors: [],
			archived: false,
			featured: false,
			category: 0
		}
	})
	const [files, setFiles] = useState<(File | string)[]>([])
	const { isUploading, startUpload } = useUploadThing('imageUploader')
	const router = useRouter()

	const { errors, isSubmitting } = form.formState

	const onSubmit = async (data: z.infer<typeof newProductSchema>) => {
		try {
			const uploadedImages = await startUpload(
				files.filter(file => file instanceof File)
			)

			const images = uploadedImages?.map(image => ({
				key: image.key,
				url: image.url
			})) as ProductImage[]

			const response = await createProduct(data, images)

			if (response.success) {
				toast.success('Product created successfully')
				form.reset()
				setFiles([])
				router.push('/dashboard/products')
			} else {
				form.setError('root', { message: response.message })
			}
		} catch (error: any) {
			form.setError('root', { message: error.message })
		}
	}

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
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='discount'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Discount (%)</FormLabel>
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
										{Object.values(Size).map(size => (
											<Button
												key={size}
												type='button'
												disabled={
													isSubmitting || !getCategoriesResponse.success
												}
												variant={
													(field.value as TSize[]).includes(size)
														? 'default'
														: 'outline'
												}
												onClick={() => {
													const updatedSizes = (
														field.value as TSize[]
													).includes(size)
														? field.value.filter(s => s !== size)
														: [...field.value, size]
													field.onChange(updatedSizes)
												}}
											>
												{size}
											</Button>
										))}
									</div>
								</FormControl>
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
														const updatedColors = (
															field.value as number[]
														).includes(color.id)
															? field.value.filter(s => s !== color.id)
															: [...field.value, color.id]
														field.onChange(updatedColors)
													}}
												>
													<div
														className='size-4 rounded-sm'
														style={{ backgroundColor: color.hexCode }}
													/>{' '}
													{color.name}
												</Button>
											))}
									</div>
								</FormControl>
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
									</SelectContent>
								</Select>
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

					<ImageDropzone
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
				</div>

				<Button
					type='submit'
					disabled={isSubmitting}
					className='ml-auto flex items-center gap-2'
				>
					{isSubmitting && <Loader2Icon className='animate-spin' />}
					{isUploading
						? 'Uploading images'
						: isSubmitting
						? 'Creating'
						: 'Create'}
				</Button>
			</form>
		</Form>
	)
}
