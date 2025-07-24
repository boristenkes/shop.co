import { Color } from '@/db/schema/colors'
import { Order, OrderItem } from '@/db/schema/orders'
import { Product } from '@/db/schema/products'
import { formatId, formatPrice, timeFormatter } from '@/utils/format'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

declare module 'jspdf' {
	interface jsPDF {
		lastAutoTable: {
			finalY: number
			[key: string]: any
		}
	}
}

export type ReceiptOrderItem = Pick<
	OrderItem,
	'productPriceInCents' | 'quantity' | 'size'
> & {
	product: Pick<Product, 'name'>
	color: Pick<Color, 'name'>
}

export type ReceiptOrder = Pick<
	Order,
	'id' | 'shippingAddress' | 'totalPriceInCents' | 'createdAt'
> & { orderItems: ReceiptOrderItem[] }

export function generateReceipt(order: ReceiptOrder) {
	const doc = new jsPDF({
		format: 'letter',
		unit: 'pt'
	})

	doc.setFontSize(22)
	doc.setTextColor(40)
	doc.text('shop.co', 40, 40)
	doc.setFontSize(12)
	doc.setTextColor(100)
	doc.text('shop.co · support@shop.co', 40, 60)

	doc.setFontSize(16)
	doc.setTextColor(30)
	doc.text(`Receipt — Order ${formatId(order.id)}`, 40, 100)

	doc.setFontSize(12)
	doc.setTextColor(80)
	doc.text(`Order Date: ${timeFormatter.format(order.createdAt)}`, 40, 120)

	doc.setFontSize(12)
	doc.setTextColor(30)
	doc.text(`Shipping Address: ${order.shippingAddress}`, 40, 150)

	autoTable(doc, {
		startY: 190,
		head: [['#', 'Product', 'Color', 'Size', 'Price', 'Qty', 'Total']],
		body: order.orderItems.map((item, idx) => [
			idx + 1,
			item.product.name,
			item.color.name,
			item.size,
			formatPrice(item.productPriceInCents),
			item.quantity,
			formatPrice(item.productPriceInCents * item.quantity)
		]),
		styles: { halign: 'left' },
		headStyles: { fillColor: [22, 119, 255], textColor: 255 }
	})

	doc.setFontSize(13)
	doc.setTextColor(20)
	doc.text(
		`Total: ${formatPrice(order.totalPriceInCents)}`,
		40,
		doc.lastAutoTable.finalY + 30
	)

	doc.setFontSize(10)
	doc.setTextColor(100)
	doc.text(
		`Thank you for shopping at shop.co!`,
		40,
		doc.lastAutoTable.finalY + 60
	)
	doc.text(
		`If you have any questions, contact us at support@shop.co`,
		40,
		doc.lastAutoTable.finalY + 75
	)

	const receiptFile = new File([doc.output('blob')], `order_${order.id}.pdf`, {
		type: 'application/pdf'
	})

	return receiptFile
}
