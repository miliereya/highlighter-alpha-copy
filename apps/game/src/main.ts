import { NestFactory } from '@nestjs/core'
import { GameModule } from './game.module'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common/pipes'
import { Logger } from 'nestjs-pino'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(GameModule)
	const configService = app.get(ConfigService)
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RMQ_URI')],
			queue: 'game',
		},
	})
	app.setGlobalPrefix('api/v1')
	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	app.useLogger(app.get(Logger))
	const config = new DocumentBuilder()
		.setTitle('Highlighter Games API')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)
	await app.startAllMicroservices()
	await app.listen(configService.get('HTTP_PORT'))
}
bootstrap()
