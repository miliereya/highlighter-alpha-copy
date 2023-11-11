import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AdminService } from '../admin.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly adminService: AdminService) {
		super()
	}

	async validate(username: string, password: string) {
		try {
			return await this.adminService.verifyAdmin(username, password)
		} catch (err) {
			throw new UnauthorizedException()
		}
	}
}
