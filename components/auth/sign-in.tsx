import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth'

export default function SignIn({
	children = <Button type='submit'>Continue with Google</Button>
}: {
	children?: React.ReactNode
}) {
	return (
		<form
			action={async () => {
				'use server'
				await signIn('google')
			}}
		>
			{children}
		</form>
	)
}
