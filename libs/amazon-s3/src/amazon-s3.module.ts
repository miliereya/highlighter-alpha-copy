import { Module } from '@nestjs/common'
import { AmazonS3Service } from './amazon-s3.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				AWS_ACCESS_KEY_ID: Joi.string().required(),
				AWS_SECRET_ACCESS_KEY: Joi.string().required(),
				AWS_S3_REGION: Joi.string().required(),
			}),
		}),
	],
	providers: [AmazonS3Service],
	exports: [AmazonS3Service],
})
export class AmazonS3Module {}
