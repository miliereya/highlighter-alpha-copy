import { userPrivateFields, userPublicFields } from '@app/common'
import {
	getFieldsForAggregate,
	getFieldsForPopulate,
	groupFieldsForAggregate,
} from '@app/common'

export const userAggregatePublicFields = (prefix = '') =>
	getFieldsForAggregate(['_id', ...userPublicFields], prefix)

export const userAggregatePrivateFields = (prefix = '') =>
	getFieldsForAggregate(userPrivateFields, prefix)

export const userPopulatePublicFields = (prefix = '') =>
	getFieldsForPopulate(userPublicFields, prefix)

export const userGroupPublicFields = (settings: {
	prefix?: string
	dontAddFirstTag?: boolean
}) =>
	groupFieldsForAggregate(['_id', ...userPublicFields], {
		prefix: settings.prefix,
		dontAddFirstTag: settings.dontAddFirstTag,
	})

export const userGroupPrivateFields = (prefix = '', dontAddFirstTag = false) =>
	groupFieldsForAggregate(['_id', ...userPrivateFields], {
		prefix,
		dontAddFirstTag,
	})
