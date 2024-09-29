'use client'

import ErrorMessage from '@/components/error-message'
import { FileState, ImageDropzone } from '@/components/image-dropzone'
import { Button } from '@/components/ui/button'
import {
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
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createProduct } from '../_lib/actions'
import { newProductSchema } from '../_lib/validations'

export default function NewProductForm() {
	const [fileStates, setFileStates] = useState<FileState[]>([])
	const form = useForm({
		resolver: zodResolver(newProductSchema),
		defaultValues: { name: '', description: '', categories: [] }
	})
	const isUploading = form.formState.isSubmitting
	const router = useRouter()

	const onSubmit = async (data: NewProductSchema) => {
		try {
			if (!fileStates?.length) throw new Error('At least one image is required')

			const uploadedFiles = fileStates.map(fileState => fileState.file)

			if (!uploadedFiles) throw new Error('Something went wrong')

			const response = await createProduct({ ...data, price: 460405 }, images)

			if (!response.success) {
				form.setError('root', { message: response.message })
				return
			}

			toast.success(response.message)
			router.push('/dashboard/products')
		} catch (error: any) {
			console.error('Upload error:', error)
			form.setError('root', { message: error.message })
		}
	}

	return (
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
				disabled={isUploading}
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
				disabled={isUploading}
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
				disabled={isUploading}
			/>

			<Button
				className='ml-auto'
				disabled={isUploading}
			>
				{isUploading && <Loader2Icon className='mr-2 size-4 animate-spin' />}
				{isUploading ? 'Creating post...' : 'Create'}
			</Button>
		</form>
	)
}
