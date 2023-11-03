import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common'
import { UserRepository } from './user.repository'
import { RegisterDto } from './dto'
import * as bcrypt from 'bcryptjs'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
	AddHighlightToUserPayload,
	User,
	parseToId,
	highlightPreviewLookup,
	LikeHighlightToUserPayload,
} from '@app/common'
import { TokenPayload } from './interfaces'
import { Response } from 'express'
import { userAggregatePrivateFields, userAggregatePublicFields } from './utils'
import { Types } from 'mongoose'

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
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

	async login(user: User, response: Response) {
		const tokenPayload: TokenPayload = {
			_id: user._id.toHexString(),
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

		return await this.getPrivateUser(user._id)
	}

	async getPrivateUser(_id: Types.ObjectId) {
		return this.userRepository.aggregateOne([
			{ $match: { _id: parseToId(_id) } },
			{
				$lookup: highlightPreviewLookup(),
			},
			{
				$project: {
					...userAggregatePrivateFields(),
				},
			},
		])
	}

	async getUserById(_id: string) {
		return this.userRepository.findOne({ _id: parseToId(_id) })
	}

	async getProfile(_id: string) {
		return this.userRepository.aggregateOne([
			{ $match: { _id: parseToId(_id) } },
			{
				$lookup: highlightPreviewLookup(),
			},
			{
				$project: {
					...userAggregatePublicFields(),
					subscribers: { $size: '$subscribers' },
					subscribed: { $size: '$subscribed' },
				},
			},
		])
	}

	async verifyUser(email: string, password: string) {
		const user = await this.userRepository.findOne({ email })
		const passwordIsValid = await bcrypt.compare(password, user.password)
		if (!passwordIsValid) {
			throw new UnauthorizedException('Credentials are not valid.')
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
		throw new UnprocessableEntityException('Email is already used.')
	}

	private async checkUsernameAvailability(username: string) {
		try {
			await this.userRepository.findOne({
				username,
			})
		} catch (err) {
			return
		}
		throw new UnprocessableEntityException('Username is already used.')
	}
}
