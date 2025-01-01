'use client'

import { cn, formatFileSize } from '@/lib/utils'
import { UploadCloudIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { forwardRef, useMemo, useState } from 'react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'
import { twMerge } from 'tailwind-merge'
import { Button } from './ui/button'

const variants = {
	base: 'relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-input transition-colors duration-200 ease-in-out',
	image:
		'border-0 p-0 w-full h-full relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md',
	active: 'border-2',
	disabled: 'cursor-default pointer-events-none opacity-50',
	accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
	reject: 'border border-red-700 bg-red-700 bg-opacity-10'
}

type InputProps = {
	className?: string
	value?: (File | string)[]
	onChange?: (files: (File | string)[]) => void | Promise<void>
	onFilesAdded?: (addedFiles: (File | string)[]) => void | Promise<void>
	disabled?: boolean
	dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>
	id?: string
}

const ERROR_MESSAGES = {
	fileTooLarge(maxSize: number) {
		return `The file is too large. Max size is ${formatFileSize(maxSize)}.`
	},
	fileInvalidType() {
		return 'Invalid file type.'
	},
	tooManyFiles(maxFiles: number) {
		return `You can only add ${maxFiles} file(s).`
	},
	fileNotSupported() {
		return 'The file is not supported.'
	}
}

const ImageDropzone = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			dropzoneOptions,
			value,
			className,
			disabled,
			onChange,
			onFilesAdded,
			...props
		},
		ref
	) => {
		const [customError, setCustomError] = useState<string>()

		const imageUrls = useMemo(() => {
			if (value) {
				return value.map(file => {
					if (typeof file === 'string') {
						// in case an url is passed in, use it to display the image
						return file
					} else {
						// in case a file is passed in, create a base64 url to display the image
						return URL.createObjectURL(file)
					}
				})
			}
			return []
		}, [value])

		// dropzone configuration
		const {
			getRootProps,
			getInputProps,
			fileRejections,
			isFocused,
			isDragAccept,
			isDragReject
		} = useDropzone({
			accept: { 'image/*': [] },
			disabled,
			onDrop: acceptedFiles => {
				setCustomError(undefined)

				if (
					dropzoneOptions?.maxFiles &&
					(value?.length ?? 0) + acceptedFiles.length > dropzoneOptions.maxFiles
				) {
					setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles))
					return
				}

				if (acceptedFiles) {
					void onFilesAdded?.(acceptedFiles)
					void onChange?.([...(value ?? []), ...acceptedFiles])
				}
			},
			...dropzoneOptions
		})

		// styling
		const dropzoneClassName = useMemo(
			() =>
				twMerge(
					variants.base,
					isFocused && variants.active,
					disabled && variants.disabled,
					(isDragReject ?? fileRejections[0]) && variants.reject,
					isDragAccept && variants.accept,
					className
				).trim(),
			[
				isFocused,
				fileRejections,
				isDragAccept,
				isDragReject,
				disabled,
				className
			]
		)

		// error validation messages
		const errorMessage = useMemo(() => {
			if (fileRejections[0]) {
				const { errors } = fileRejections[0]
				if (errors[0]?.code === 'file-too-large') {
					return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0)
				} else if (errors[0]?.code === 'file-invalid-type') {
					return ERROR_MESSAGES.fileInvalidType()
				} else if (errors[0]?.code === 'too-many-files') {
					return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0)
				} else {
					return ERROR_MESSAGES.fileNotSupported()
				}
			}

			return undefined
		}, [fileRejections, dropzoneOptions])

		return (
			<div>
				<div className='grid grid-cols-[repeat(1,1fr)] gap-2 sm:grid-cols-[repeat(2,1fr)] lg:grid-cols-[repeat(3,1fr)] xl:grid-cols-[repeat(4,1fr)]'>
					{/* Images */}
					{value?.map((file, index) => (
						<div
							key={index}
							className={cn(variants.image + ' aspect-square', {
								'opacity-50': disabled
							})}
						>
							<Image
								className='h-full w-full rounded-md object-cover'
								src={imageUrls[index]}
								alt={typeof file === 'string' ? file : file.name}
								fill
							/>
							{/* Remove Image Icon */}
							{imageUrls[index] && !disabled && (
								<div
									className='group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform'
									onClick={e => {
										e.stopPropagation()
										void onChange?.(value.filter((_, i) => i !== index) ?? [])
									}}
								>
									<div className='flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-transform duration-300 hover:scale-110 dark:border-gray-400 dark:bg-black'>
										<XIcon
											className='text-gray-500 dark:text-gray-400'
											width={16}
											height={16}
										/>
									</div>
								</div>
							)}
						</div>
					))}

					{/* Dropzone */}
					{(!value || value.length < (dropzoneOptions?.maxFiles ?? 0)) && (
						<div
							{...getRootProps({
								className: dropzoneClassName
							})}
						>
							{/* Main File Input */}
							<input
								ref={ref}
								{...props}
								{...getInputProps()}
							/>
							<div className='flex flex-col items-center justify-center text-xs text-gray-400'>
								<UploadCloudIcon className='mb-2 h-7 w-7' />
								<div className='text-gray-400'>
									Drag & Drop images to upload
								</div>
								<div className='mt-3'>
									<Button
										type='button'
										size='sm'
										variant='outline'
										disabled={disabled}
									>
										select
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
				{/* Error Text */}
				<div className='mt-1 text-xs text-red-500'>
					{customError ?? errorMessage}
				</div>
			</div>
		)
	}
)

ImageDropzone.displayName = 'ImageDropzone'

export { ImageDropzone }
