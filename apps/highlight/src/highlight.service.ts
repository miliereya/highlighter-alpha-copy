import {
	AddHighlightToUserPayload,
	GetHighlightsPreviewsPayload,
	LikeHighlightToUserPayload,
	TypeLikeAction,
	USER_MESSAGE_PATTERNS,
	USER_SERVICE,
	UserCurrent,
	getFieldsForProject,
	highlightPreviewFields,
	parseToId,
} from '@app/common'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CreateHighlightDto } from './dto'
import { HighlightRepository } from './highlight.repository'
import { LikeHighlightDto } from './dto/like-highlight.dto'
import { HighlightPreview } from '@app/common/types/highlight.types'

@Injectable()
export class HighlightService {
	constructor(
		@Inject(USER_SERVICE) private readonly userService: ClientProxy,
		private readonly highlightRepository: HighlightRepository
	) {}

	async createHighlight(user: UserCurrent, dto: CreateHighlightDto) {
		const highlight = await this.highlightRepository.create({
			...dto,
			game: parseToId(dto.game),
			by: parseToId(user._id),
		})
		this.userService.emit<void, AddHighlightToUserPayload>(
			USER_MESSAGE_PATTERNS.ADD_HIGHLIGHT,
			{
				highlightId: highlight._id,
				userId: user._id,
			}
		)
	}

	async getPreviews(dto: GetHighlightsPreviewsPayload) {
		const highlights =
			await this.highlightRepository.aggregate<HighlightPreview>([
				{ $match: { by: dto.by } },
				{
					$project: {
						...getFieldsForProject(highlightPreviewFields),
						comments: { $size: '$comments' },
					},
				},
			])
		return highlights
	}

	async likeHighlight(dto: LikeHighlightDto) {
		await this.highlightRepository.findOneAndUpdate(
			{ _id: parseToId(dto.highlightId) },
			{ $inc: { likes: dto.isLiked ? -1 : 1 } }
		)

		this.userService.emit<TypeLikeAction, LikeHighlightToUserPayload>(
			USER_MESSAGE_PATTERNS.LIKE_HIGHLIGHT,
			dto
		)
	}
}
