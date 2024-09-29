import { auth } from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
	productImages: f({
		image: { maxFileSize: '4MB', minFileCount: 1, maxFileCount: 10 }
	})
		.middleware(async ({ req }) => {
			const session = await auth()

			if (!session) throw new UploadThingError('Unauthorized')

			return { userId: session.user.id }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete for userId:', metadata.userId)

			console.log('file url', file.url)

			return { fileUrl: file.url }
		})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
