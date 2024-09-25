'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useRouter } from 'nextjs-toploader/app'

export function BackButton(props: ButtonProps) {
	const { back } = useRouter()

	return (
		<Button
			type='button'
			onClick={back}
			{...props}
		/>
	)
}
