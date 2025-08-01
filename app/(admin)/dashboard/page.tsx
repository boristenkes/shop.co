import ErrorMessage from '@/components/error-message'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { getStatistics } from '@/utils/actions'
import { intFormatter } from '@/utils/format'
import { DollarSign, ShoppingBag, Star, Users } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function Dashboard() {
	const session = await auth()
	const currentUser = session?.user

	if (
		!currentUser ||
		!['moderator', 'admin', 'admin:demo'].includes(currentUser.role)
	)
		notFound()

	const response = await getStatistics()

	if (!response.success) return <ErrorMessage message={response.message} />

	const { results } = response

	return (
		<div className='space-y-8 container'>
			<h1 className='text-3xl font-bold'>Dashboard Overview</h1>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Products
						</CardTitle>
						<ShoppingBag className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{intFormatter.format(results.productCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Users</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{intFormatter.format(results.userCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Reviews</CardTitle>
						<Star className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{intFormatter.format(results.reviewCount)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<DollarSign className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{intFormatter.format(results.totalRevenue ?? 0)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
