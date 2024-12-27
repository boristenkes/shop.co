import { footerLinkGroups, socials } from '@/constants'
import Logo from './icons/logo'
import NewsletterForm from './newsletter-form'

export default function Footer() {
	return (
		<footer className='mt-20 bg-gray-100 pb-12'>
			<div className='mx-4'>
				<NewsletterForm className='' />
			</div>

			<div className='container mt-12 px-4 flex flex-wrap justify-between gap-4 border-b-2 border-b-gray-200 pb-12'>
				<div>
					<Logo />
					<p className='text-balance text-gray-600 max-w-[30rem] mt-6 mb-9'>
						We have clothes that suits your style and which you&apos;re proud to
						wear. From women to men.
					</p>

					<ul className='flex items-center gap-4'>
						{socials.map(social => (
							<li key={social.name}>
								<a
									href={social.link}
									target='_blank'
									rel='noreferrer'
									aria-label={social.name}
									className='p-2 rounded-full bg-neutral-100 border-2 border-gray-200 hover:bg-neutral-900 group transition-colors grid place-content-center'
								>
									<social.icon className='size-5 group-hover:fill-neutral-100 transition-[fill]' />
								</a>
							</li>
						))}
					</ul>
				</div>

				<div className='flex justify-between flex-1 flex-wrap gap-4'>
					{footerLinkGroups.map(group => (
						<div key={group.title}>
							<h3 className='text-lg font-semibold text-neutral-900 uppercase mb-6 tracking-[3px]'>
								{group.title}
							</h3>
							<ul className='mt-2 space-y-3'>
								{group.links.map(link => (
									<li key={link.title}>
										<a
											href={link.href}
											className='text-gray-600 hover:text-neutral-900 transition-colors hover:underline'
										>
											{link.title}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className='container px-4 mt-8 text-gray-600 flex items-center justify-between'>
				<p>&copy; 2000-{new Date().getFullYear()}, All rights reserved</p>

				<p className='text-sm'>
					Designed by{' '}
					<a
						href='https://www.figma.com/community/file/1273571982885059508'
						target='_blank'
						rel='noreferrer'
						className='text-gray-600 hover:text-neutral-900 underline transition-colors'
					>
						Hamza Naeem
					</a>
					, Developed by{' '}
					<a
						href='https://boristenkes.com'
						target='_blank'
						className='text-gray-600 hover:text-neutral-900 underline transition-colors'
					>
						Boris Tenkes
					</a>
				</p>
			</div>
		</footer>
	)
}
