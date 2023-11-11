import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import {
	ADMIN_SERVICE,
	Admin,
	AdminSchema,
	DatabaseModule,
	HealthModule,
	LoggerModule,
} from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { JwtModule } from '@nestjs/jwt'
import { AdminRepository } from './admin.repository'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
	imports: [
		LoggerModule,
		DatabaseModule,
		DatabaseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
				ADMIN_HOST: Joi.string().required(),
			}),
		}),
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
				},
			}),
			inject: [ConfigService],
		}),
		ClientsModule.registerAsync([
			{
				name: ADMIN_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: configService.getOrThrow<string>('ADMIN_HOST'),
					},
				}),
				inject: [ConfigService],
			},
		]),
		HealthModule,
	],
	controllers: [AdminController],
	providers: [AdminService, AdminRepository, LocalStrategy, JwtStrategy],
})
export class AdminModule {}
