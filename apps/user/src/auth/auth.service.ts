import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { UserRepository } from '../user.repository'
import { ConfirmEmailDto, LoginDto, RegisterDto } from './dto'
import * as bcrypt from 'bcryptjs'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
	EMAIL_SERVICE,
	EMAIL_MESSAGE_PATTERNS,
	SendEmailPayload,
	parseToId,
	UserPreview,
	getFieldsForSelect,
	userPreviewFields,
} from '@app/common'
import { AuthTokenPayload, VerificationTokenPayload } from './interfaces'
import { Response } from 'express'
import { ClientProxy } from '@nestjs/microservices'
import { UserService } from '../user.service'
import { Types } from 'mongoose'

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		@Inject(EMAIL_SERVICE)
		private readonly emailService: ClientProxy
	) {}

	async register(dto: RegisterDto) {
		await this.checkEmailAvailability(dto.email)
		await this.checkUsernameAvailability(dto.username)
		const user = await this.userRepository.create({
			...dto,
			password: await bcrypt.hash(dto.password, 10),
		})

		this.sendVerificationLink(user.email)
	}

	async login(dto: LoginDto, response: Response) {
		const verifiedUser = await this.verifyUser(dto)
		const user = await this.userService.getPrivateUser(verifiedUser._id)

		await this.generateToken(user._id, response)

		return user
	}

	async refresh(userId: Types.ObjectId, response: Response) {
		const user = await this.userService.getPrivateUser(userId)
		await this.generateToken(userId, response)

		return user
	}

	async getUserPreview(email: string) {
		return await this.userRepository.findOneAndSelect<UserPreview>(
			{ email, isEmailConfirmed: false },
			getFieldsForSelect(userPreviewFields) + '-_id'
		)
	}

	async verifyUser(dto: LoginDto) {
		const { email, password } = dto
		const user = await this.userRepository.findOne({ email })
		const passwordIsValid = await bcrypt.compare(password, user.password)
		if (!passwordIsValid) {
			throw new UnauthorizedException('Credentials are not valid')
		}
		return user
	}

	private async generateToken(userId: Types.ObjectId, response: Response) {
		const tokenPayload: AuthTokenPayload = {
			_id: userId.toHexString(),
		}

		const expires = new Date()
		expires.setSeconds(
			expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
		)

		const token = this.jwtService.sign(tokenPayload)

		response.cookie('Authentication', token, {
			httpOnly: true,
			expires,
		})
	}

	private async checkEmailAvailability(email: string) {
		try {
			await this.userRepository.findOne({
				email,
			})
		} catch (err) {
			return
		}
		throw new BadRequestException('Email is already used.')
	}

	private async checkUsernameAvailability(username: string) {
		try {
			await this.userRepository.findOne({
				username,
			})
		} catch (err) {
			return
		}
		throw new BadRequestException('Username is already used.')
	}

	async getUserById(_id: string) {
		return await this.userRepository.findOneAndSelect(
			{
				_id: parseToId(_id),
			},
			'-password'
		)
	}

	sendVerificationLink(email: string) {
		const payload: VerificationTokenPayload = { email }
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
			expiresIn: `${this.configService.get(
				'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME'
			)}s`,
		})

		const url = `${this.configService.get(
			'EMAIL_CONFIRMATION_URL'
		)}?token=${token}`

		const text = `Welcome to the highlighter. To confirm the email address, click here: ${url}`

		this.emailService.emit<void, SendEmailPayload>(
			EMAIL_MESSAGE_PATTERNS.SEND,
			{
				to: email,
				subject: 'Email confirmation',
				from: 'highlighter.development@gmail.com',
				text: text,
			}
		)
	}

	async confirmEmail(dto: ConfirmEmailDto) {
		const email = await this.decodeConfirmationToken(dto.token)
		const user = await this.userRepository.findOne({ email })
		if (user.isEmailConfirmed) {
			throw new BadRequestException('Email already confirmed')
		}
		await this.userRepository.findOneAndUpdate(
			{ email },
			{ isEmailConfirmed: true }
		)
	}

	async resendConfirmationLink(email: string) {
		const user = await this.userRepository.findOne({ email })
		if (user.isEmailConfirmed) {
			throw new BadRequestException('Email already confirmed')
		}
		this.sendVerificationLink(user.email)
	}

	private async decodeConfirmationToken(token: string) {
		try {
			const payload = await this.jwtService.verify(token, {
				secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
			})

			if (typeof payload === 'object' && 'email' in payload) {
				return payload.email
			}
			throw new BadRequestException()
		} catch (error) {
			if (error?.name === 'TokenExpiredError') {
				throw new BadRequestException(
					'Email confirmation token expired'
				)
			}
			throw new BadRequestException('Invalid confirmation token')
		}
	}
}
