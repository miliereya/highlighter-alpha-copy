import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard, LocalAuthGuard } from './guards'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
	ADMIN_MESSAGE_PATTERNS,
	AdminAuthPayload,
	AdminData,
	CurrentAdmin,
	OwnerGuard,
} from '@app/common'
import { Response } from 'express'
import { RegisterDto } from './dto'

@Controller('admins')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Post('register')
	@OwnerGuard()
	async register(@Body() dto: RegisterDto) {
		await this.adminService.registerUser(dto)
	}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@CurrentAdmin() admin: AdminData,
		@Res({ passthrough: true }) response: Response
	) {
		const jwt = await this.adminService.login(admin, response)
		response.send(jwt)
	}

	@UseGuards(JwtAuthGuard)
	@Get('refresh')
	async refresh(
		@CurrentAdmin() admin: AdminData,
		@Res({ passthrough: true }) response: Response
	) {
		const jwt = await this.adminService.login(admin, response)
		response.send(jwt)
	}

	@UseGuards(JwtAuthGuard)
	@MessagePattern(ADMIN_MESSAGE_PATTERNS.AUTHENTICATE)
	async authenticate(@Payload() data: AdminAuthPayload) {
		return data.user
	}
}
