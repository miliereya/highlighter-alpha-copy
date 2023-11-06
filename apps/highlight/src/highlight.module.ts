import { Module } from '@nestjs/common'
import { HighlightController } from './highlight.controller'
import { HighlightService } from './highlight.service'
import {
	DatabaseModule,
	Highlight,
	HighlightSchema,
	LoggerModule,
	USER_SERVICE,
} from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { HighlightRepository } from './highlight.repository'

@Module({
	imports: [
		DatabaseModule,
		DatabaseModule.forFeature([
			{ name: Highlight.name, schema: HighlightSchema },
		]),
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
				USER_HOST: Joi.string().required(),
			}),
		}),
		ClientsModule.registerAsync([
			{
				name: USER_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: 'user',
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
	controllers: [HighlightController],
	providers: [HighlightService, HighlightRepository],
})
export class HighlightModule {}
