import ErrorMessage from '@/components/error-message'
import { BackButton } from '@/components/utils/back-button'
import { getProductFAQsForAdmin } from '@/features/faq/actions/read'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import FAQList from './_components/list'

export default async function ProductFAQsPage(props: {
	params: Promise<{ id: string }>
}) {
	const session = await auth()
	const currentUser = session?.user

	if (!currentUser || !hasPermission(currentUser.role, 'products', ['update']))
		notFound()

	const productId = (await props.params).id

	const response = await getProductFAQsForAdmin(Number(productId))

	if (!response.success)
		return <ErrorMessage message={response.message || 'Something went wrong'} />

	const product = response.product

	return (
		<main className='container py-16'>
			<header className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<BackButton
						variant='outline'
						className='rounded-sm text-sm'
					>
						<ArrowLeft /> Back
					</BackButton>
					<h1 className='text-3xl font-bold'>Product FAQs</h1>
				</div>

				{/* <ProductSelect /> */}
			</header>

			<FAQList
				faqs={product.faqs}
				productId={product.id}
			/>
		</main>
	)
}
