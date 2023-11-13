import { Body, Controller, Param, Post } from '@nestjs/common'
import { HighlightService } from './highlight.service'
import {
	Auth,
	CurrentUser,
	GetHighlightsPreviewsPayload,
	HIGHLIGHT_MESSAGE_PATTERNS,
	UserCurrent,
} from '@app/common'
import { CreateHighlightDto } from './dto'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller('highlights')
export class HighlightController {
	constructor(private readonly highlightService: HighlightService) {}

	@Post('create')
	@Auth()
	async create(
		@CurrentUser() user: UserCurrent,
		@Body() dto: CreateHighlightDto
	) {
		return this.highlightService.createHighlight(user, dto)
	}

	@Post('like/:_id')
	@Auth()
	async like(@CurrentUser() user: UserCurrent, @Param('_id') _id: string) {
		await this.highlightService.likeHighlight({
			userId: user._id,
			highlightId: _id,
			isLiked: !!user.likedHighlights.find((h) => String(h) === _id),
		})
	}

	@MessagePattern(HIGHLIGHT_MESSAGE_PATTERNS.GET_PREVIEWS)
	async getPreviews(@Payload() dto: GetHighlightsPreviewsPayload) {
		const res = await this.highlightService.getPreviews(dto)
		console.log(res)
		return res
	}
}
