import { Sidebar } from '../_components/sidebar'

export const metadata = {
	title: {
		default: 'Admin',
		template: '%s • shop.co'
	},
	description: 'Manage your ecommerce store'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex min-h-screen bg-gray-100'>
			<Sidebar />
			<main className='grow p-8 container'>{children}</main>
		</div>
	)
}
