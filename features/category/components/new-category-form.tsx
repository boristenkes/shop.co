import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const categorySchema = z.object({
	name: z.string().min(1, 'Name is required')
})

export default function NewCategoryForm() {
	const form = useForm({
		resolver: zodResolver(categorySchema),
		defaultValues: { name: '' }
	})

	const onSubmit = async (data: z.infer<typeof categorySchema>) => {}

	return (
		<Form {...form}>
			<form
				id='category-form'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder='Winter Clothes'
									form='category-form'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter className='mt-4'>
					<Button
						type='button'
						form='category-form'
					>
						Create
					</Button>
				</DialogFooter>
			</form>
		</Form>
	)
}

{
	/* <Dialog>
  <DialogTrigger asChild>
    <Button
      variant='ghost'
      size='sm'
      className='p-0 h-7'
    >
      <PlusCircleIcon className='size-4 mr-2' />
      Add category
    </Button>
  </DialogTrigger>
  <DialogContent>
    <NewCategoryForm />
  </DialogContent>
</Dialog> */
}
