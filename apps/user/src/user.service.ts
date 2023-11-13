import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { UserRepository } from './user.repository'
import { LoginDto, RegisterDto } from './dto'
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
} from '@app/common'
import { TokenPayload } from './interfaces'
import { Response } from 'express'
import { Types } from 'mongoose'
import { ClientProxy } from '@nestjs/microservices'
import { HighlightPreview } from '@app/common/types/highlight.types'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		@Inject(HIGHLIGHT_SERVICE)
		private readonly highlightService: ClientProxy
	) {}

	async registerUser(dto: RegisterDto) {
		await this.checkEmailAvailability(dto.email)
		await this.checkUsernameAvailability(dto.username)
		const user = await this.userRepository.create({
			...dto,
			password: await bcrypt.hash(dto.password, 10),
		})

		delete user.password
		return user
	}

	async login(dto: LoginDto, response: Response) {
		const verifiedUser = await this.verifyUser(dto)
		const user = await this.getPrivateUser(verifiedUser._id)

		const tokenPayload: TokenPayload = {
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
		const user = await this.userRepository.findOne({ _id: parseToId(_id) })
		delete user.password
		return user
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
}
