import { Module } from '@nestjs/common'
import { GameService } from './game.service'
import { GameController } from './game.controller'
import { CATEGORY_SERVICE, DatabaseModule, LoggerModule } from '@app/common'
import { Game, GameSchema } from './models/game.schema'
import { GameRepository } from './game.repository'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
				CATEGORY_HOST: Joi.string().required(),
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
		]),
		DatabaseModule,
		DatabaseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
		LoggerModule,
	],
	controllers: [GameController],
	providers: [GameService, GameRepository],
})
export class GameModule {}
