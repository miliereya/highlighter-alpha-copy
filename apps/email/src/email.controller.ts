import { Controller } from '@nestjs/common'
import { EmailService } from './email.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { EMAIL_MESSAGE_PATTERNS, SendEmailPayload } from '@app/common'

@Controller()
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@MessagePattern(EMAIL_MESSAGE_PATTERNS.SEND)
	async sendEmail(@Payload() payload: SendEmailPayload) {
		return this.emailService.send(payload)
	}
}
