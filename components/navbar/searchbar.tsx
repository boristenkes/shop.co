'use client'

import { SearchIcon } from 'lucide-react'
import Link from 'next/link'

export default function Searchbar() {
	return (
		<Link
			href='/search'
			aria-label='Search'
		>
			<SearchIcon />
		</Link>
	)
}

// export default function Searchbar() {
// 	const [expanded, setExpanded] = useState(false)
// 	const [searchTerm, setSearchTerm] = useState('')
// 	const debouncedValue = useDebounce(searchTerm, 250)

// 	useEffect(() => {
// 		if (debouncedValue) {
// 			console.log(`Sending request for "${debouncedValue}"...`)
// 		}
// 	}, [debouncedValue])

// 	if (!expanded)
// 		return (
// 			<button onClick={() => setExpanded(true)}>
// 				<SearchIcon />
// 			</button>
// 		)

// 	return (
// 		<Form
// 			action='/products'
// 			className='absolute inset-0 bg-gray-100 rounded-sm max-w-2xl w-full'
// 		>
// 			<SubmitButton
// 				variant='ghost'
// 				aria-label='Search'
// 				className='absolute left-0 top-0 h-full px-3'
// 			>
// 				<SearchIcon />
// 			</SubmitButton>

// 			<SubmitInput
// 				value={searchTerm}
// 				onChange={e => setSearchTerm(e.target.value)}
// 				name='query'
// 				type='search'
// 				className='absolute inset-0 z-10 bg-gray-100 pl-10 inline-block w-full'
// 			/>
// 		</Form>
// 	)
// }
