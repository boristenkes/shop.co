import { Sidebar } from '../_components/sidebar'

export const metadata = {
	title: 'Ecommerce Admin Dashboard',
	description: 'Manage your ecommerce store'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex h-screen bg-gray-100'>
			<Sidebar />
			<main className='flex-1 overflow-y-auto p-8'>{children}</main>
		</div>
	)
}
