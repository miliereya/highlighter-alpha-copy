import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterDto } from './dto'
import {
	AddHighlightToUserPayload,
	CurrentUser,
	LikeHighlightToUserPayload,
	USER_MESSAGE_PATTERNS,
	User,
	UserPrivate,
} from '@app/common'
import { Response } from 'express'
import { JwtAuthGuard, LocalAuthGuard } from './guards'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	async register(@Body() dto: RegisterDto) {
		await this.userService.registerUser(dto)
	}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		const jwt = await this.userService.login(user, response)
		response.send(jwt)
	}

	@UseGuards(JwtAuthGuard)
	@Get('refresh')
	async refresh(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		const jwt = await this.userService.login(user, response)
		response.send(jwt)
	}

	@Get('profile/:_id')
	async profile(@Param('_id') _id: string) {
		return this.userService.getProfile(_id)
	}

	@UseGuards(JwtAuthGuard)
	@MessagePattern(USER_MESSAGE_PATTERNS.AUTHENTICATE)
	async authenticate(@Payload() data: { user: UserPrivate }) {
		return data.user
	}

	@MessagePattern(USER_MESSAGE_PATTERNS.ADD_HIGHLIGHT)
	async addHighlight(@Payload() payload: AddHighlightToUserPayload) {
		await this.userService.addHighlight(payload)
	}

	@MessagePattern(USER_MESSAGE_PATTERNS.LIKE_HIGHLIGHT)
	async likeHighlight(@Payload() payload: LikeHighlightToUserPayload) {
		await this.userService.likeHighlight(payload)
	}
}
