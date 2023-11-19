import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import {
	DatabaseModule,
	EMAIL_SERVICE,
	HIGHLIGHT_SERVICE,
	HealthModule,
	LoggerModule,
	User,
	UserSchema,
} from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { UserRepository } from './user.repository'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './strategies/local.strategy'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
	imports: [
		LoggerModule,
		DatabaseModule,
		DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.string().required(),
				HTTP_PORT: Joi.number().required(),
				JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
				JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
				EMAIL_CONFIRMATION_URL: Joi.string().required(),
			}),
		}),
		ClientsModule.registerAsync([
			{
				name: HIGHLIGHT_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: HIGHLIGHT_SERVICE,
					},
				}),
				inject: [ConfigService],
			},
			{
				name: EMAIL_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RMQ_URI')],
						queue: EMAIL_SERVICE,
					},
				}),
				inject: [ConfigService],
			},
		]),
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
				},
			}),
			inject: [ConfigService],
		}),
		HealthModule,
	],
	controllers: [UserController],
	providers: [UserService, UserRepository, LocalStrategy, JwtStrategy],
})
export class UserModule {}
