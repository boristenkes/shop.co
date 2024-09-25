'use client'

import { FileState, ImageDropzone } from '@/components/image-dropzone'
import SubmitButton from '@/components/submit-button'
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
import { useEdgeStore } from '@/lib/edgestore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { newProductSchema } from '../_lib/validations'

export default function NewProductForm() {
	const { edgestore } = useEdgeStore()

	const [fileStates, setFileStates] = useState<FileState[]>([])
	const form = useForm({
		resolver: zodResolver(newProductSchema),
		defaultValues: {
			name: '',
			description: '',
			images: []
		}
	})

	const updateFileProgress = (key: string, progress: FileState['progress']) => {
		setFileStates(fileStates => {
			const newFileStates = structuredClone(fileStates)
			const fileState = newFileStates.find(fileState => fileState.key === key)

			if (fileState) fileState.progress = progress

			return newFileStates
		})
	}

	const onSubmit = async (data: z.infer<typeof newProductSchema>) => {
		console.log(data)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid gap-6'
			>
				<FormField
					control={form.control}
					name='name'
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

				<FormField
					control={form.control}
					name='images'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Images</FormLabel>
							<FormControl>
								<ImageDropzone
									{...field}
									value={fileStates}
									dropzoneOptions={{
										maxFiles: 10
									}}
									onChange={files => {
										setFileStates(files)
									}}
									onFilesAdded={async addedFiles =>
										setFileStates([...fileStates, ...addedFiles])
									}
								/>
							</FormControl>
							<FormDescription>
								Upload up to 10 images, max 4MB each
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<SubmitButton className='ml-auto'>Create</SubmitButton>
			</form>
		</Form>
	)
}

//  await Promise.all(
// addedFiles.map(async addedFileState => {
// try {
// const res = await edgestore.publicFiles.upload({
// file: addedFileState.file,
// onProgressChange: async progress => {
// updateFileProgress(addedFileState.key, progress)
// if (progress === 100) {
// 						// wait 1 second to set it to complete
// 						// so that the user can see the progress bar at 100%
// await new Promise(resolve =>
// setTimeout(resolve, 1000)
// )
// updateFileProgress(
// addedFileState.key,
// 'COMPLETE'
// )
// }
// }
// })

// console.log(res)
// } catch (err) {
// updateFileProgress(addedFileState.key, 'ERROR')
// }
