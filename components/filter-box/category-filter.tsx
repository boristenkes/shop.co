import { getCategories } from '@/features/category/actions/read'
import ErrorMessage from '../error-message'
import CategoryCheckbox from './category-checkbox'

export default async function CategoriesFilter() {
	const response = await getCategories()

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-bold'>Categories</h3>

			{response.success ? (
				<ul className='flex flex-wrap gap-x-2 gap-y-6'>
					{response.categories.map(category => (
						<li key={category.slug}>
							<CategoryCheckbox category={category} />
						</li>
					))}
				</ul>
			) : (
				<ErrorMessage message='Something went wrong.' />
			)}
		</div>
	)
}
