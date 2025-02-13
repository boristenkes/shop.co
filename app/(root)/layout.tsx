import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import SiteNotice from '@/components/site-notice'

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='pt-20'>
			<SiteNotice />
			<Navbar />
			{children}
			<Footer />
		</div>
	)
}
