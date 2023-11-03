import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { DatabaseModule, LoggerModule, User, UserSchema } from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { UserRepository } from './user.repository'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './strategies/local.strategy'

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
	],
	controllers: [UserController],
	providers: [UserService, UserRepository, LocalStrategy, JwtStrategy],
})
export class UserModule {}
