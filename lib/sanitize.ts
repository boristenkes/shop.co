import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export const sanitizeConfig = {
	ALLOWED_TAGS: [
		'b', 'i', 'em', 'strong',
		'a', 'p', 'br', 'ul',
		'ol', 'li', 'h3', 'h4'
	],
	ALLOWED_ATTR: ['href', 'target', 'rel']
}

export const sanitizeHTML = (html: string): string => {
	const cleanHTML = DOMPurify.sanitize(html, sanitizeConfig)

	return cleanHTML
}
