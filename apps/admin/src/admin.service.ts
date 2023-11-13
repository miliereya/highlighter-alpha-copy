import {
	Injectable,
	UnauthorizedException,
	BadRequestException,
} from '@nestjs/common'
import { AdminRepository } from './admin.repository'
import * as bcrypt from 'bcryptjs'
import { Types } from 'mongoose'
import {
	AdminData,
	adminFields,
	adminRoles,
	getFieldsForAggregate,
	parseToId,
} from '@app/common'
import { Response } from 'express'
import { RegisterDto } from './dto'
import { TokenPayload } from './interfaces'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AdminService {
	constructor(
		private readonly adminRepository: AdminRepository,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	async registerUser(dto: RegisterDto) {
		if (!adminRoles.find((role) => role === dto.role)) {
			throw new BadRequestException(`Invalid role: ${dto.role}`)
		}
		await this.checkUsernameAvailability(dto.username)
		const user = await this.adminRepository.create({
			...dto,
			password: await bcrypt.hash(dto.password, 10),
		})

		delete user.password
		return user
	}

	async login(user: AdminData, response: Response) {
		const tokenPayload: TokenPayload = {
			_id: user._id.toHexString(),
		}

		const expires = new Date()
		expires.setSeconds(
			expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
		)

		const token = this.jwtService.sign(tokenPayload)

		response.cookie('Admin', token, {
			httpOnly: true,
			expires,
		})

		return await this.getAdminById(user._id)
	}

	async verifyAdmin(username: string, password: string) {
		const admin = await this.adminRepository.findOne({ username })
		const passwordIsValid = await bcrypt.compare(password, admin.password)
		if (!passwordIsValid) {
			throw new UnauthorizedException('Credentials are not valid.')
		}
		delete admin.password
		return admin
	}

	async getAdminById(_id: Types.ObjectId) {
		return this.adminRepository.aggregateOne([
			{ $match: { _id: parseToId(_id) } },
			{
				$project: getFieldsForAggregate(adminFields),
			},
		])
	}

	private async checkUsernameAvailability(username: string) {
		try {
			await this.adminRepository.findOne({
				username,
			})
		} catch (err) {
			return
		}
		throw new BadRequestException('Username is already used.')
	}
}
