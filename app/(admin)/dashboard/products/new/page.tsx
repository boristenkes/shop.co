import NewProductForm from '@/features/product/components/new-product-form'

export default function NewProductPage() {
	return (
		<main className='container py-16'>
			<div className='grid gap-1 mb-8'>
				<h1 className='text-3xl font-semibold tracking-tight'>
					Create product
				</h1>
				<p className='text-sm text-muted-foreground'>Add a new product</p>
			</div>

			<NewProductForm />
		</main>
	)
}
