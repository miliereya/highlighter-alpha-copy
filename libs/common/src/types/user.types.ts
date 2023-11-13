import { ApiProperty, PickType } from '@nestjs/swagger'
import {
	userCurrentFields,
	userPrivateFields,
	userPublicFields,
} from '../fields'
import { User } from '../models'
import { HighlightPreview } from './highlight.types'

export class UserCurrent extends PickType(User, userCurrentFields) {}

export class UserPublic extends PickType(User, userPublicFields) {}

export class UserWithPrivateFields extends PickType(User, userPrivateFields) {}

export class UserPrivate extends PickType(User, userPrivateFields) {
	@ApiProperty({ type: [HighlightPreview] })
	highlightsPreview: HighlightPreview[]
}
