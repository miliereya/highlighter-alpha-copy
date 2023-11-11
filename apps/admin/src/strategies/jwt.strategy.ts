import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from '../interfaces/token-payload.interface'
import { AdminService } from '../admin.service'
import { parseToId } from '@app/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly adminService: AdminService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: any) =>
					request?.cookies?.Admin ||
					request?.Admin ||
					request?.headers.Admin,
			]),
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate({ _id }: TokenPayload) {
		return this.adminService.getAdminById(parseToId(_id))
	}
}
