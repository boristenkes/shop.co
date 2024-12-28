import Footer from '@/components/footer'

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div>
			{children}
			<Footer />
		</div>
	)
}
