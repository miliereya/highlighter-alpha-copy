import { NestFactory } from '@nestjs/core'
import { UserModule } from './user.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { Logger } from 'nestjs-pino'
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { USER_SERVICE } from '@app/common'

async function bootstrap() {
	const app = await NestFactory.create(UserModule)
	const configService = app.get(ConfigService)
	app.use(cookieParser())
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RMQ_URI')],
			queue: USER_SERVICE,
		},
	})
	app.setGlobalPrefix('api/v1')
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	app.useLogger(app.get(Logger))
	const config = new DocumentBuilder()
		.setTitle('Highlighter User API')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			withCredentials: true,
			tagsSorter: 'alpha',
		},
	})
	app.enableCors({
		exposedHeaders: ['Bearer'],
		credentials: true,
		origin: configService.get('CLIENT_WEB_URL') ?? 'http://localhost:3000',
	})
	await app.startAllMicroservices()
	await app.listen(configService.get('HTTP_PORT'))
}
bootstrap()
