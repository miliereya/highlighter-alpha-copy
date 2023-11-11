import { TimeStampsWithId } from '.'
import { adminFields } from '../fields'
import { Admin } from '../models'

export type TypeAdminRole = 'moderator' | 'creator' | 'owner'

type TypeAdminFields = (typeof adminFields)[number]

export interface AdminData
	extends Pick<Admin, TypeAdminFields>,
		TimeStampsWithId {}
