'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const newProductSchema = z.object({
	name: z.string().min(1, 'Name is required')
})

export default function NewProductForm() {
	const form = useForm({
		resolver: zodResolver(newProductSchema),
		defaultValues: {
			name: ''
		}
	})

	const onSubmit = async (data: z.infer<typeof newProductSchema>) => {
		// ...
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
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
								This is first thing customers see, so make it count
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
