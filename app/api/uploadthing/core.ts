import { auth } from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: '4MB',
			maxFileCount: 10,
			minFileCount: 1
		}
	})
		.middleware(async () => {
			const session = await auth()
			const currentUser = session?.user

			if (!currentUser || !['admin', 'admin:demo'].includes(currentUser.role))
				throw new UploadThingError('Unauthorized')

			return { userId: currentUser.id }
		})
		.onUploadComplete(async () => {
			// console.log('Upload complete for userId:', metadata.userId)
			// console.log('file url', file.url)
			// return { uploadedBy: metadata.userId }
		})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
