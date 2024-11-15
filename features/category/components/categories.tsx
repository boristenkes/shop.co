'use client'

import ErrorMessage from '@/components/error-message'
import { Checkbox } from '@/components/ui/checkbox'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { fetchCategories } from '../lib/actions'

type Props = {
	form: UseFormReturn<any>
}

export function Categories({ form }: Props) {
	const {
		data: categories,
		isLoading,
		error,
		isError
	} = useQuery({
		queryKey: ['categories'],
		queryFn: () => fetchCategories()
	})

	if (isError) return <ErrorMessage message={error.message} />

	return (
		<FormField
			control={form.control}
			name='categories'
			render={() => (
				<FormItem>
					<div className='mb-4'>
						{/* <p className='text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1'> */}
						<FormLabel>Categories</FormLabel>
						{/* </p> */}
						<FormDescription>
							Select categories for this product.
						</FormDescription>
					</div>
					{isLoading ? (
						<p className='text-sm flex items-center gap-2'>
							<Loader2Icon className='size-4 animate-spin' />
							Loading categories
						</p>
					) : (
						categories?.map(item => (
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
												checked={field.value?.includes(item.id)}
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
											/>
										</FormControl>
										<FormLabel className='font-normal m-0'>
											{item.name}
										</FormLabel>
									</FormItem>
								)}
							/>
						))
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
