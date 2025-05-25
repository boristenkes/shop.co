'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Role, TRole } from '@/db/schema/enums'
import { User } from '@/db/schema/users'
import { updateUser } from '@/features/user/actions/update'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const roleSchema = z.nativeEnum(Role)

type RoleSelectProps = { userId: User['id']; defaultRole: TRole }

export default function RoleSelect({ userId, defaultRole }: RoleSelectProps) {
	const [isPending, startTransition] = useTransition()

	const handleChange = async (newRole: TRole) => {
		startTransition(async () => {
			newRole = roleSchema.parse(newRole)

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
				{Object.values(Role)
					.filter(role => role !== 'anonymous')
					.map(role => (
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
