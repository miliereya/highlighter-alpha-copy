import { Module } from '@nestjs/common'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { DatabaseModule, LoggerModule } from '@app/common'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
				AWS_ACCESS_KEY_ID: Joi.string().required(),
				AWS_SECRET_ACCESS_KEY: Joi.string().required(),
				AWS_S3_REGION: Joi.string().required(),
			}),
		}),
		DatabaseModule,
		LoggerModule,
	],
	controllers: [FileController],
	providers: [FileService],
})
export class FileModule {}
