import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { UserRepository } from './user.repository'
import { ConfirmEmailDto, LoginDto, RegisterDto } from './dto'
import * as bcrypt from 'bcryptjs'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
	AddHighlightToUserPayload,
	parseToId,
	LikeHighlightToUserPayload,
	UserPublic,
	UserWithPrivateFields,
	getFieldsForSelect,
	userPrivateFields,
	HIGHLIGHT_SERVICE,
	HIGHLIGHT_MESSAGE_PATTERNS,
	GetHighlightsPreviewsPayload,
	UserPrivate,
	HighlightPreview,
	EMAIL_SERVICE,
	EMAIL_MESSAGE_PATTERNS,
	SendEmailPayload,
} from '@app/common'
import { AuthTokenPayload, VerificationTokenPayload } from './interfaces'
import { Response } from 'express'
import { Types } from 'mongoose'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		@Inject(HIGHLIGHT_SERVICE)
		private readonly highlightService: ClientProxy,
		@Inject(EMAIL_SERVICE)
		private readonly emailService: ClientProxy
	) {}

	async registerUser(dto: RegisterDto) {
		await this.checkEmailAvailability(dto.email)
		await this.checkUsernameAvailability(dto.username)
		const user = await this.userRepository.create({
			...dto,
			password: await bcrypt.hash(dto.password, 10),
		})

		delete user.password
		this.sendVerificationLink(user.email)
	}

	async login(dto: LoginDto, response: Response) {
		const verifiedUser = await this.verifyUser(dto)
		const user = await this.getPrivateUser(verifiedUser._id)

		const tokenPayload: AuthTokenPayload = {
			_id: verifiedUser._id.toHexString(),
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

		return user
	}

	async getPrivateUser(_id: Types.ObjectId) {
		const user =
			await this.userRepository.findOneAndSelect<UserWithPrivateFields>(
				{ _id },
				getFieldsForSelect(userPrivateFields)
			)

		const highlightsPreview = await lastValueFrom(
			this.highlightService
				.send<HighlightPreview[], GetHighlightsPreviewsPayload>(
					HIGHLIGHT_MESSAGE_PATTERNS.GET_PREVIEWS,
					{ by: user._id }
				)
				.pipe(
					map((res) => {
						return res
					})
				)
		)

		const userPrivate: UserPrivate = {
			...user,
			highlightsPreview,
		}

		return userPrivate
	}

	async getUserById(_id: string) {
		return await this.userRepository.findOneAndSelect(
			{
				_id: parseToId(_id),
			},
			'-password'
		)
	}

	async getProfile(_id: string) {
		return this.userRepository.aggregateOne<UserPublic>([
			{ $match: { _id: parseToId(_id) } },
			{
				$project: {
					subscribers: { $size: '$subscribers' },
					subscribed: { $size: '$subscribed' },
				},
			},
		])
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

	async addHighlight(dto: AddHighlightToUserPayload) {
		await this.userRepository.findOneAndUpdate(
			{ _id: parseToId(dto.userId) },
			{ $push: { highlights: parseToId(dto.highlightId) } }
		)
	}

	async likeHighlight(dto: LikeHighlightToUserPayload) {
		await this.userRepository.findOneAndUpdate(
			{
				_id: parseToId(dto.userId),
			},
			dto.isLiked
				? { $pull: { likedHighlights: parseToId(dto.highlightId) } }
				: { $push: { likedHighlights: parseToId(dto.highlightId) } }
		)
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
			throw new BadRequestException('Bad confirmation token')
		}
	}
}
