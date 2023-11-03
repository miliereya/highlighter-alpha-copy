import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class LikeHighlightDto {
	@IsNotEmpty()
	@IsString()
	highlightId: string

	@IsNotEmpty()
	@IsString()
	userId: string | Types.ObjectId

	@IsBoolean()
	isLiked: boolean
}
