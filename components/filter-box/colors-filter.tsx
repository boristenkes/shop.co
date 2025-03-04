import { getColors } from '@/features/color/actions/read'
import ErrorMessage from '../error-message'
import ColorCheckbox from './color-checkbox'

export default async function ColorsFilter() {
	const response = await getColors()

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-bold'>Colors</h3>

			{response.success ? (
				<ul className='flex flex-wrap gap-2'>
					{response.colors.map(color => (
						<li key={color.slug}>
							<ColorCheckbox color={color} />
						</li>
					))}
				</ul>
			) : (
				<ErrorMessage message='Something went wrong.' />
			)}
		</div>
	)
}
