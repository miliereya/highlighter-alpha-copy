import { Module } from '@nestjs/common'
import { GameService } from './game.service'
import { GameController } from './game.controller'
import {
	ADMIN_SERVICE,
	CATEGORY_SERVICE,
	DatabaseModule,
	Game,
	GameSchema,
	LoggerModule,
} from '@app/common'
import { GameRepository } from './game.repository'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AmazonS3Module } from '@app/amazon-s3'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
				CATEGORY_HOST: Joi.string().required(),
				ADMIN_HOST: Joi.string().required(),
			}),
		}),
		ClientsModule.registerAsync([
			{
				name: CATEGORY_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: configService.getOrThrow<string>(
							'CATEGORY_HOST'
						),
					},
				}),
				inject: [ConfigService],
			},
			{
				name: ADMIN_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: configService.getOrThrow<string>('ADMIN_HOST'),
					},
				}),
				inject: [ConfigService],
			},
		]),
		AmazonS3Module,
		DatabaseModule,
		DatabaseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
		LoggerModule,
	],
	controllers: [GameController],
	providers: [GameService, GameRepository],
})
export class GameModule {}
