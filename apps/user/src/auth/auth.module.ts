import {
	DatabaseModule,
	EMAIL_SERVICE,
	HIGHLIGHT_SERVICE,
	HealthModule,
	LoggerModule,
	User,
	UserSchema,
} from '@app/common'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { UserController } from '../user.controller'
import { AuthController } from './auth.controller'
import { UserService } from '../user.service'
import { AuthService } from './auth.service'
import { UserRepository } from '../user.repository'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		LoggerModule,
		DatabaseModule,
		DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		ClientsModule.registerAsync([
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
		AuthModule,
	],
	controllers: [UserController, AuthController],
	providers: [
		UserService,
		AuthService,
		UserRepository,
		LocalStrategy,
		JwtStrategy,
	],
})
export class AuthModule {}
