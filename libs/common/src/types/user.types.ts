import { ApiProperty, PickType } from '@nestjs/swagger'
import {
	userCurrentFields,
	userPreviewFields,
	userPrivateFields,
	userProfileFields,
} from '../fields'
import { User } from '../models'
import { HighlightPreview } from './highlight.types'
import { USER_EXAMPLE } from '@app/api'

export class UserCurrent extends PickType(User, userCurrentFields) {}

export class UserProfileNotFilled extends PickType(User, userProfileFields) {
	@ApiProperty({ type: Number, example: USER_EXAMPLE.subscribersCount })
	subscribers: number

	@ApiProperty({ type: Number, example: USER_EXAMPLE.subscribedCount })
	subscribed: number
}

export class UserProfile extends UserProfileNotFilled {
	@ApiProperty({ type: [HighlightPreview] })
	highlightsPreview: HighlightPreview[]
}

export class UserPrivate extends PickType(User, userPrivateFields) {}

export class UserPreview extends PickType(User, userPreviewFields) {}
