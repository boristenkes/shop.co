import * as Social from '@/components/icons/socials'
import gucciLogo from '@/public/assets/images/gucci.png'
import kevinKleinLogo from '@/public/assets/images/kevin-clein.png'
import pradaLogo from '@/public/assets/images/prada.png'
import versaceLogo from '@/public/assets/images/versace.png'
import zaraLogo from '@/public/assets/images/zara.png'

export const navLinks = [
	{
		href: '/',
		title: 'Home'
	},
	{
		href: '/products',
		title: 'Products'
	},
	{
		href: '/brands',
		title: 'Brands'
	},
	{
		href: '/dashboard',
		title: 'Dashboard'
	}
]

export const brands = [
	{
		name: 'versace',
		image: versaceLogo,
		href: 'https://www.versace.com'
	},
	{
		name: 'zara',
		image: zaraLogo,
		href: 'https://www.zara.com'
	},
	{
		name: 'gucci',
		image: gucciLogo,
		href: 'https://www.gucci.com'
	},
	{
		name: 'prada',
		image: pradaLogo,
		href: 'https://www.prada.com'
	},
	{
		name: 'kevin-clein',
		image: kevinKleinLogo,
		href: 'https://www.calvinklein.com'
	}
]

export const socials = [
	{
		name: 'x',
		link: 'https://x.com',
		icon: Social.XLogo
	},
	{
		name: 'facebook',
		link: 'https://facebook.com',
		icon: Social.FacebookLogo
	},
	{
		name: 'instagram',
		link: 'https://instagram.com',
		icon: Social.InstagramLogo
	},
	{
		name: 'github',
		link: 'https://github.com/boristenkes',
		icon: Social.GithubLogo
	}
]

export const footerLinkGroups = [
	{
		title: 'Company',
		links: [
			{
				href: '#',
				title: 'About'
			},
			{
				href: '#',
				title: 'Features'
			},
			{
				href: '#',
				title: 'Works'
			},
			{
				href: '#',
				title: 'Career'
			}
		]
	},
	{
		title: 'Help',
		links: [
			{
				href: '#',
				title: 'Customer Support'
			},
			{
				href: '#',
				title: 'Delivery Details'
			},
			{
				href: '#',
				title: 'Terms & Conditions'
			},
			{
				href: '#',
				title: 'Privacy Policy'
			}
		]
	},
	{
		title: 'FAQ',
		links: [
			{
				href: '#',
				title: 'Account'
			},
			{
				href: '#',
				title: 'Manage Deliveries'
			},
			{
				href: '#',
				title: 'Orders'
			},
			{
				href: '#',
				title: 'Payment'
			}
		]
	},
	{
		title: 'Resources',
		links: [
			{
				href: '#',
				title: 'Free eBooks'
			},
			{
				href: '#',
				title: 'Development Tutorial'
			},
			{
				href: '#',
				title: 'How to - Blog'
			},
			{
				href: '#',
				title: 'YouTube Playlist'
			}
		]
	}
]
