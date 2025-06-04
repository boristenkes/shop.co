import Navbar from '../_components/navbar'
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
		<div className='flex max-lg:flex-col min-h-screen bg-gray-100'>
			<Sidebar />
			<Navbar />
			<main className='grow py-8 lg:px-8 container'>{children}</main>
		</div>
	)
}
