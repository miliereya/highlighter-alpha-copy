import { Types } from 'mongoose'

export interface AddHighlightToUserPayload {
	highlightId: Types.ObjectId
	userId: Types.ObjectId
}

export interface GetHighlightsPreviewsPayload {
	by: Types.ObjectId
}

export interface LikeHighlightToUserPayload {
	highlightId: Types.ObjectId | string
	userId: Types.ObjectId | string
	isLiked: boolean
}
