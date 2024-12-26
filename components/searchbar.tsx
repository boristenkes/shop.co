import { SearchIcon } from 'lucide-react'
import Form from 'next/form'
import SubmitButton from './submit-button'
import SubmitInput from './submit-input'

export default function Searchbar() {
	return (
		<Form
			action='/products'
			className='relative bg-gray-100 rounded-sm max-w-2xl w-full'
		>
			<SubmitButton
				variant='ghost'
				aria-label='Search'
				className='absolute left-0 top-0 h-full px-3'
			>
				<SearchIcon />
			</SubmitButton>

			<SubmitInput
				name='query'
				type='search'
				className='bg-transparent pl-10 inline-block w-full'
			/>
		</Form>
	)
}
