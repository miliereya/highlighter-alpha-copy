import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailService, MailDataRequired } from '@sendgrid/mail'

@Injectable()
export class EmailService {
	constructor(
		private readonly configService: ConfigService,
		private readonly mailService: MailService
	) {
		this.mailService.setApiKey(
			this.configService.get<string>('SEND_GRID_KEY')
		)
	}

	async send(mail: MailDataRequired) {
		const clientResponse = await this.mailService.send(mail)
		console.log(mail)
		console.log(clientResponse)
		return clientResponse
	}
}
