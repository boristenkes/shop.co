import Providers from '@/components/utils/providers'
import { satoshi } from '@/lib/fonts'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
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
			<head>
				<link
					rel='icon'
					href='/assets/icons/favicon-dark.svg'
					media='(prefers-color-scheme: light)'
				/>
				<link
					rel='icon'
					href='/assets/icons/favicon-light.svg'
					media='(prefers-color-scheme: dark)'
				/>
			</head>
			<body className={`${satoshi.className} antialiased scroll-smooth`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
