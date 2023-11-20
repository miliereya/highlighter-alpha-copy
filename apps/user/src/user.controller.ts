import { Controller, Get, Param } from '@nestjs/common'
import { UserService } from './user.service'
import {
	AddHighlightToUserPayload,
	LikeHighlightToUserPayload,
	USER_MESSAGE_PATTERNS,
	User,
	UserProfile,
} from '@app/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { ApiGetById } from '@app/api'

@ApiTags('User')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile/:_id')
	@ApiGetById({ document: User.name, type: UserProfile })
	async profile(@Param('_id') _id: string) {
		return this.userService.getProfile(_id)
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
