'use client'

import ErrorMessage from '@/components/error-message'
import { FileState, ImageDropzone } from '@/components/image-dropzone'
import { Button } from '@/components/ui/button'
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
import { Categories } from '@/features/category/components/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createProduct } from '../_lib/actions'
import { type NewProductSchema, newProductSchema } from '../_lib/validations'

export default function NewProductForm() {
	const [fileStates, setFileStates] = useState<FileState[]>([])
	const form = useForm({
		resolver: zodResolver(newProductSchema),
		defaultValues: { name: '', description: '', categories: [] }
	})
	const { isSubmitting } = form.formState

	const onSubmit = async (data: NewProductSchema) => {
		try {
			if (!fileStates?.length) throw new Error('At least one image is required')

			const uploadedFiles = fileStates.map(fileState => fileState.file)

			if (!uploadedFiles) throw new Error('Something went wrong')

			const formData = new FormData()

			fileStates.forEach(f => {
				formData.append('images', f.file, f.file.name)
			})

			// @ts-expect-error
			const response = await createProduct({ ...data, price: 460405 }, formData)

			if (!response.success) {
				form.setError('root', { message: response.message })
				return
			}

			toast.success(response.message)
			form.reset()
			setFileStates([])
		} catch (error: any) {
			console.error('Upload error:', error)
			form.setError('root', { message: error.message })
		}
	}

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
								<Input {...field} />
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
								<Textarea {...field} />
							</FormControl>
							<FormDescription>
								This is first thing customers see, so make it count!
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Categories form={form} />

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
					disabled={isSubmitting}
				>
					{isSubmitting && <Loader2Icon className='mr-2 size-4 animate-spin' />}
					{isSubmitting ? 'Creating post...' : 'Create'}
				</Button>
			</form>
		</Form>
	)
}
