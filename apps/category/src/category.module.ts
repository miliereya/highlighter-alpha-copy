import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { CategoryRepository } from './category.repository'
import { DatabaseModule, GAME_SERVICE, LoggerModule } from '@app/common'
import { Category, CategorySchema } from './models/category.schema'
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
				GAME_HOST: Joi.string().required(),
			}),
		}),
		LoggerModule,
		DatabaseModule,
		DatabaseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
		]),
		ClientsModule.registerAsync([
			{
				name: GAME_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: configService.getOrThrow<string>('GAME_HOST'),
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
	controllers: [CategoryController],
	providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
