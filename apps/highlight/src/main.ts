import { NestFactory } from '@nestjs/core'
import { HighlightModule } from './highlight.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices'
import { HIGHLIGHT_SERVICE } from '@app/common'

async function bootstrap() {
	const app = await NestFactory.create(HighlightModule)
	const configService = app.get(ConfigService)
	app.use(cookieParser())
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RMQ_URI')],
			queue: HIGHLIGHT_SERVICE,
		},
	})
	app.setGlobalPrefix('api/v1')
	// app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
	app.useLogger(app.get(Logger))
	app.enableCors({
		credentials: true,
		origin: configService.get('CLIENT_WEB_URL') ?? 'http://localhost:3000',
	})
	await app.startAllMicroservices()
	await app.listen(configService.get('HTTP_PORT'))
}
bootstrap()
