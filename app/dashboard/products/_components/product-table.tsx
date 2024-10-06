import { prisma } from '@/lib/prisma'
import { prettyJson } from '@/lib/utils'

export default async function ProductTable() {
	const products = await prisma.product.findMany({
		include: {
			categories: true
		}
	})

	console.log(prettyJson(products))

	return <div></div>
}
