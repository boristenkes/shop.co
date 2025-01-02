import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '../ui/skeleton'

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between gap-4'>
					<Skeleton className='h-10 w-48 rounded-sm' />
					<Skeleton className='h-8 w-20 rounded-full' />
				</div>
			</CardHeader>
			<CardContent>
				<div className='grid gap-4'>
					{Array.from({ length: rows }, (_, idx) => idx).map(idx => (
						<Skeleton
							key={idx}
							className='h-16 w-full rounded-lg'
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
