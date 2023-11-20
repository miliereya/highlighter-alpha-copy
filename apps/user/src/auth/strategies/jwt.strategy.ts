import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthTokenPayload } from '../interfaces/token-payloads.interface'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly authService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: any) =>
					request?.cookies?.Authentication ||
					request?.Authentication ||
					request?.headers.Authentication,
			]),
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}
	async validate({ _id }: AuthTokenPayload) {
		return this.authService.getUserById(_id)
	}
}
