import { Module } from '@nestjs/common'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { MailService } from '@sendgrid/mail'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			isGlobal: true,
			validationSchema: Joi.object({
				RMQ_URI: Joi.string().required(),
				SEND_GRID_KEY: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
			}),
		}),
	],
	controllers: [EmailController],
	providers: [EmailService, MailService],
})
export class EmailModule {}
