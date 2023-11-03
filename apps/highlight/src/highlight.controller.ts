import { Body, Controller, Param, Post } from '@nestjs/common'
import { HighlightService } from './highlight.service'
import { Auth, CurrentUser, UserPrivate } from '@app/common'
import { CreateHighlightDto } from './dto'

@Controller('highlights')
export class HighlightController {
	constructor(private readonly highlightService: HighlightService) {}

	@Post('create')
	@Auth()
	async create(
		@CurrentUser() user: UserPrivate,
		@Body() dto: CreateHighlightDto
	) {
		return this.highlightService.createHighlight(user, dto)
	}

	@Post('like/:_id')
	@Auth()
	async like(@CurrentUser() user: UserPrivate, @Param('_id') _id: string) {
		await this.highlightService.likeHighlight({
			userId: user._id,
			highlightId: _id,
			isLiked: !!user.likedHighlights.find((h) => String(h) === _id),
		})
	}
}
