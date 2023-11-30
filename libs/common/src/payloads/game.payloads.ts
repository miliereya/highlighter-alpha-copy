import { Types } from 'mongoose'

export interface GetGamesPayload {
	category: Types.ObjectId
}

export interface AddCategoryToGamesPayload {
	gameIds: string[] | Types.ObjectId[]
	categoryId: string | Types.ObjectId
}

export interface RemoveDeletedCategoryPayload {
	categoryId: string
}
