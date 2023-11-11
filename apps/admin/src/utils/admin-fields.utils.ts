import {
	adminFields,
	getFieldsForAggregate,
	getFieldsForPopulate,
	groupFieldsForAggregate,
} from '@app/common'

export const moderatorAggregateFields = (prefix = '') =>
	getFieldsForAggregate(['_id', ...adminFields], prefix)

export const moderatorPopulateFields = (prefix = '') =>
	getFieldsForPopulate(adminFields, prefix)

export const moderatorGroupFields = (settings: {
	prefix?: string
	dontAddFirstTag?: boolean
}) =>
	groupFieldsForAggregate(['_id', ...adminFields], {
		prefix: settings.prefix,
		dontAddFirstTag: settings.dontAddFirstTag,
	})
