import { NestFactory } from '@nestjs/core'
import { HighlightModule } from './highlight.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { Logger } from 'nestjs-pino'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(HighlightModule)
	const configService = app.get(ConfigService)
	app.use(cookieParser())
	app.setGlobalPrefix('api/v1')
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	app.useLogger(app.get(Logger))
	await app.listen(configService.get('HTTP_PORT'))
}
bootstrap()
