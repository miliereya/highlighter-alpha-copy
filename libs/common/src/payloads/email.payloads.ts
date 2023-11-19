export interface SendEmailPayload {
	to: string
	subject: string
	from: string
	text: string
	html?: string
}
