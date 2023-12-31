import { NestFactory } from '@nestjs/core'
import { CategoryModule } from './category.module'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common/pipes'
import { Logger } from 'nestjs-pino'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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
	const config = new DocumentBuilder()
		.setTitle('Highlighter Categories API')
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
