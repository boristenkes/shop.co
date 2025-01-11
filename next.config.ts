import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'utfs.io',
				pathname: '/f/*'
			},
			{
				protocol: 'https',
				hostname: '25bc672inm.ufs.sh',
				pathname: '/f/*'
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/a/*'
			}
		]
	}
}

export default nextConfig
