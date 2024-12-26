import localFont from 'next/font/local'

export const satoshi = localFont({
	src: [
		{
			path: '../public/assets/fonts/satoshi/satoshi-regular.woff2',
			style: 'normal',
			weight: '400'
		},
		{
			path: '../public/assets/fonts/satoshi/satoshi-medium.woff2',
			style: 'normal',
			weight: '500'
		},
		{
			path: '../public/assets/fonts/satoshi/satoshi-bold.woff2',
			style: 'normal',
			weight: '700'
		}
	]
})

export const integralCf = localFont({
	src: [
		{
			path: '../public/assets/fonts/integral/integralcf-bold.woff2',
			style: 'normal',
			weight: '700'
		},
		{
			path: '../public/assets/fonts/integral/integralcf-medium.woff2',
			style: 'normal',
			weight: '500'
		},
		{
			path: '../public/assets/fonts/integral/integralcf-regular.woff2',
			style: 'normal',
			weight: '400'
		}
	]
})
