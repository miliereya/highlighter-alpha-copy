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
import {
	ConfirmEmailDto,
	LoginDto,
	RegisterDto,
	ResendConfirmEmailDto,
} from './dto'
import {
	AUTH_MESSAGE_PATTERNS,
	AuthPayload,
	CurrentUser,
	User,
	UserPreview,
	UserPrivate,
} from '@app/common'
import { Response } from 'express'
import { JwtAuthGuard } from './guards'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import {
	ApiConfirmEmail,
	ApiGetOne,
	ApiLogin,
	ApiRefresh,
	ApiRegister,
	USER_EXAMPLE,
} from '@app/api'
import { AuthService } from './auth.service'
import { Throttle } from '@nestjs/throttler'
import { ApiResendEmail } from '@app/api/decorators/resend-email.decorator'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiRegister()
	async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto)
	}

	@Post('login')
	@ApiLogin({ type: UserPrivate })
	@HttpCode(200)
	async login(
		@Res({ passthrough: true }) response: Response,
		@Body() dto: LoginDto
	) {
		const userData = await this.authService.login(dto, response)
		response.send(userData)
	}

	@UseGuards(JwtAuthGuard)
	@ApiRefresh({ type: UserPrivate })
	@ApiTags('Authentication')
	@Get('refresh')
	async refresh(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		const jwt = await this.authService.refresh(user._id, response)
		response.send(jwt)
	}

	@ApiTags('Email Confirmation')
	@Get('preview/:email')
	@ApiGetOne({
		document: User.name,
		example: USER_EXAMPLE.email,
		name: 'email',
		type: UserPreview,
	})
	async getUserPreview(
		@Param('email')
		email: string
	) {
		return await this.authService.getUserPreview(email)
	}

	@ApiTags('Email Confirmation')
	@ApiConfirmEmail()
	@HttpCode(200)
	@Post('confirm-email')
	async confirmEmail(@Body() dto: ConfirmEmailDto) {
		await this.authService.confirmEmail(dto)
	}

	@ApiTags('Email Confirmation')
	@ApiResendEmail()
	@Throttle({ default: { limit: 1, ttl: 1000 } })
	@HttpCode(200)
	@Post('resend-confirmation-link')
	async resendConfirmationLink(@Body() dto: ResendConfirmEmailDto) {
		await this.authService.resendConfirmationLink(dto.email)
	}

	@UseGuards(JwtAuthGuard)
	@MessagePattern(AUTH_MESSAGE_PATTERNS.AUTHENTICATE)
	async authenticate(@Payload() data: AuthPayload) {
		return data.user
	}
}
