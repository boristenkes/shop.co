import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		default: 'shop.co',
		template: '%s • shop.co'
	},
	description:
		'Mock ecommerce website built by Web Developer (@boristenkes on GitHub) as practice project to demonstrate web development skills',
	keywords: [
		'Next.js',
		'Boris Tenkes',
		'shop.co',
		'Ecommerce website',
		'Web developer projects'
	],
	authors: [{ name: 'Boris Tenkeš', url: 'https://boristenkes.com' }],
	creator: 'https://boristenkes.com',
	applicationName: 'shop.co'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	)
}
