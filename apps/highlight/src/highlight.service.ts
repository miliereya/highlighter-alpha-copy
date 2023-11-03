import {
	AddHighlightToUserPayload,
	LikeHighlightToUserPayload,
	TypeLikeAction,
	USER_MESSAGE_PATTERNS,
	USER_SERVICE,
	UserPrivate,
	parseToId,
} from '@app/common'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CreateHighlightDto } from './dto'
import { HighlightRepository } from './highlight.repository'
import { LikeHighlightDto } from './dto/like-highlight.dto'

@Injectable()
export class HighlightService {
	constructor(
		@Inject(USER_SERVICE) private readonly userService: ClientProxy,
		private readonly highlightRepository: HighlightRepository
	) {}

	async createHighlight(user: UserPrivate, dto: CreateHighlightDto) {
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
