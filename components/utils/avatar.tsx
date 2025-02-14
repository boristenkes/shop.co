'use client'

import { AVATAR_DEFAULT } from '@/constants'
import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

export type AvatarProps = ImageProps

export default function Avatar({ src, className, ...props }: AvatarProps) {
	const [source, setSource] = useState(src ?? AVATAR_DEFAULT)

	return (
		<Image
			src={source}
			className={cn('aspect-square rounded-full', className)}
			onError={() => setSource(AVATAR_DEFAULT)}
			{...props}
		/>
	)
}
