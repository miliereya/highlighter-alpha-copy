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
import { LoginDto, RegisterDto } from './dto'
import {
	AddHighlightToUserPayload,
	AuthPayload,
	CurrentUser,
	LikeHighlightToUserPayload,
	USER_MESSAGE_PATTERNS,
	User,
	UserPrivate,
} from '@app/common'
import { Response } from 'express'
import { JwtAuthGuard } from './guards'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { ApiGetById, ApiJwt, ApiLogin, ApiRegister } from '@app/api'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	@ApiTags('Public')
	@ApiRegister()
	async register(@Body() dto: RegisterDto) {
		await this.userService.registerUser(dto)
	}

	@Post('login')
	@ApiLogin({ type: UserPrivate })
	@ApiTags('Public')
	@HttpCode(200)
	async login(
		@Res({ passthrough: true }) response: Response,
		@Body() dto: LoginDto
	) {
		const userData = await this.userService.login(dto, response)
		response.send(userData)
	}

	@UseGuards(JwtAuthGuard)
	@ApiJwt()
	@ApiTags('User')
	@Get('refresh')
	async refresh(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		const jwt = await this.userService.login(user, response)
		response.send(jwt)
	}

	@Get('profile/:_id')
	@ApiTags('Public')
	@ApiGetById({ document: User.name, type: String })
	async profile(@Param('_id') _id: string) {
		return this.userService.getProfile(_id)
	}

	@UseGuards(JwtAuthGuard)
	@MessagePattern(USER_MESSAGE_PATTERNS.AUTHENTICATE)
	async authenticate(@Payload() data: AuthPayload) {
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
