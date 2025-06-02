'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { User } from '@/db/schema/users'
import { updateUser } from '@/features/user/actions/update'
import { Role, roles } from '@/lib/enums'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

type RoleSelectProps = { userId: User['id']; defaultRole: Role }

export default function RoleSelect({ userId, defaultRole }: RoleSelectProps) {
	const [isPending, startTransition] = useTransition()

	const handleChange = async (newRole: Role) => {
		startTransition(async () => {
			newRole = z.enum(roles).parse(newRole)

			const response = await updateUser(userId, { role: newRole })

			if (!response.success)
				toast.error('Failed to assign role. Please try again later.')
		})
	}

	return (
		<Select
			onValueChange={handleChange}
			defaultValue={defaultRole}
			disabled={isPending}
		>
			<SelectTrigger
				disabled={isPending}
				className='capitalize max-w-40'
			>
				<SelectValue placeholder={defaultRole} />
			</SelectTrigger>
			<SelectContent>
				{roles.map(role => (
					<SelectItem
						key={role}
						value={role}
						className='capitalize'
					>
						{role}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
