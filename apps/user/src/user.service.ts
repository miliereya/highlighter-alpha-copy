import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import {
	AddHighlightToUserPayload,
	parseToId,
	LikeHighlightToUserPayload,
	getFieldsForSelect,
	userPrivateFields,
	HIGHLIGHT_SERVICE,
	HIGHLIGHT_MESSAGE_PATTERNS,
	GetHighlightsPreviewsPayload,
	UserPrivate,
	HighlightPreview,
	UserProfile,
	UserProfileNotFilled,
	getFieldsForProject,
	userProfileFields,
} from '@app/common'
import { Types } from 'mongoose'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		@Inject(HIGHLIGHT_SERVICE)
		private readonly highlightService: ClientProxy
	) {}

	async getPrivateUser(_id: Types.ObjectId) {
		return await this.userRepository.findOneAndSelect<UserPrivate>(
			{ _id },
			getFieldsForSelect(userPrivateFields)
		)
	}

	async getProfile(_id: string): Promise<UserProfile> {
		const user =
			await this.userRepository.aggregateOne<UserProfileNotFilled>([
				{ $match: { _id: parseToId(_id) } },
				{
					$project: {
						...getFieldsForProject(userProfileFields),
						subscribers: { $size: '$subscribers' },
						subscribed: { $size: '$subscribed' },
					},
				},
			])

		const highlightsPreview = await lastValueFrom(
			this.highlightService
				.send<HighlightPreview[], GetHighlightsPreviewsPayload>(
					HIGHLIGHT_MESSAGE_PATTERNS.GET_PREVIEWS,
					{ by: user._id }
				)
				.pipe(
					map((res) => {
						return res
					})
				)
		)

		return {
			...user,
			highlightsPreview,
		}
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
}
