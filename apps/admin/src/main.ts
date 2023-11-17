import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { Logger } from 'nestjs-pino'
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices'
import { AdminModule } from './admin.module'

async function bootstrap() {
	const app = await NestFactory.create(AdminModule)
	const configService = app.get(ConfigService)
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RMQ_URI')],
			queue: 'admin',
		},
	})
	app.use(cookieParser())
	app.setGlobalPrefix('api/v1')
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	app.useLogger(app.get(Logger))
	app.enableCors({
		credentials: true,
		origin:
			configService.get('CLIENT_ADMIN_URL') ?? 'http://localhost:3010',
	})
	await app.startAllMicroservices()
	await app.listen(configService.get('HTTP_PORT'))
}
bootstrap()
