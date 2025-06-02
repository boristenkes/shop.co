import { Coupon } from '@/db/schema/coupons'
import { formatPrice } from '@/utils/format'

export type CouponDiscountProps = React.ComponentProps<'span'> &
	Pick<Coupon, 'value' | 'type'>

export default function CouponDiscount({
	value,
	type,
	...props
}: CouponDiscountProps) {
	return (
		<span {...props}>
			-{type === 'fixed' ? formatPrice(value) : value + '%'}
		</span>
	)
}
