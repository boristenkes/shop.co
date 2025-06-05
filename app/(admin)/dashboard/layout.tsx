import { auth } from '@/lib/auth'
import Navbar from '../_components/navbar'
import { Sidebar } from '../_components/sidebar'

export const metadata = {
	title: {
		default: 'Admin',
		template: '%s • shop.co'
	},
	description: 'Manage your ecommerce store'
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const isDemoAdmin = await auth().then(
		session => session?.user.role === 'admin:demo'
	)

	return (
		<div className='flex max-lg:flex-col min-h-screen bg-gray-100'>
			<Sidebar />
			<div className='grow'>
				{isDemoAdmin && (
					<p
						role='alert'
						className='text-center z-10 py-2 px-2 text-neutral-100 bg-red-500 text-wrap'
					>
						You&apos;re using a demo admin account. Some features are
						restricted.
					</p>
				)}
				<Navbar />
				<main className='grow py-8 lg:px-8 container'>{children}</main>
			</div>
		</div>
	)
}
