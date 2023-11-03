import { NestFactory } from '@nestjs/core'
import { CategoryModule } from './category.module'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common/pipes'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
	const app = await NestFactory.create(CategoryModule)
	const configService = app.get(ConfigService)
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RMQ_URI')],
			queue: 'category',
		},
	})
	app.setGlobalPrefix('api/v1')
	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	app.useLogger(app.get(Logger))
	await app.startAllMicroservices()
	await app.listen(configService.get('HTTP_PORT'))
}
bootstrap()
