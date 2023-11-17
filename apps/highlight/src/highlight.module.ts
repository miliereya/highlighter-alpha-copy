import { Module } from '@nestjs/common'
import { HighlightController } from './highlight.controller'
import { HighlightService } from './highlight.service'
import {
	DatabaseModule,
	HealthModule,
	Highlight,
	HighlightSchema,
	LoggerModule,
	USER_SERVICE,
} from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { HighlightRepository } from './highlight.repository'
import { AmazonS3Module } from '@app/amazon-s3'

@Module({
	imports: [
		DatabaseModule,
		DatabaseModule.forFeature([
			{ name: Highlight.name, schema: HighlightSchema },
		]),
		AmazonS3Module,
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
				RMQ_URI: Joi.string().required(),
			}),
		}),
		ClientsModule.registerAsync([
			{
				name: USER_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: USER_SERVICE,
					},
				}),
				inject: [ConfigService],
			},
		]),
		HealthModule,
	],
	controllers: [HighlightController],
	providers: [HighlightService, HighlightRepository],
})
export class HighlightModule {}
