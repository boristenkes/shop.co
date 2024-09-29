'use client'

import {
	QueryClient,
	QueryClientProvider as ReactQueryClientProvider
} from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

const queryClient = new QueryClient()

const QueryClientProvider = (props: PropsWithChildren) => (
	<ReactQueryClientProvider
		client={queryClient}
		{...props}
	/>
)

export default QueryClientProvider
