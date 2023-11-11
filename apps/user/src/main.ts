import { NestFactory } from '@nestjs/core'
import { UserModule } from './user.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { Logger } from 'nestjs-pino'
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(UserModule)
	const configService = app.get(ConfigService)
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RMQ_URI')],
			queue: 'user',
		},
	})
	app.use(cookieParser())
	app.setGlobalPrefix('api/v1')
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
