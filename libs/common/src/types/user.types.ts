import { TimeStampsWithId, _id } from '.'
import { userPrivateFields, userPublicFields } from '../fields'
import { User } from '../models'
import { HighlightPublic } from './highlight.types'

type TypeUserPublicFields = (typeof userPublicFields)[number]
type TypeUserPrivateFields = (typeof userPrivateFields)[number]

export interface UserPrivate
	extends Pick<User, TypeUserPrivateFields>,
		TimeStampsWithId {}

export interface UserPublic extends Pick<User, TypeUserPublicFields>, _id {
	highlights: HighlightPublic[]
}
