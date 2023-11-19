import { NestFactory } from '@nestjs/core'
import { EmailModule } from './email.module'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common/pipes'

async function bootstrap() {
	const app = await NestFactory.create(EmailModule)
	const configService = app.get(ConfigService)
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RMQ_URI')],
			queue: 'email',
		},
	})
	app.setGlobalPrefix('api/v1')
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	await app.startAllMicroservices()
	await app.listen(configService.get('HTTP_PORT'))
}
bootstrap()
