import { highlightPreviewFields } from '@app/common/fields'
import {
	getFieldsForAggregate,
	getFieldsForPopulate,
	groupFieldsForAggregate,
} from '../mongo.utils'

export const highlightAggregatePreviewFields = (prefix = '') =>
	getFieldsForAggregate(['_id', ...highlightPreviewFields], prefix)

// export const highlightAggregatePrivateFields = (prefix = '') =>
// 	getFieldsForAggregate(highlightPrivateFields, prefix)

export const highlightPopulatePreviewFields = (prefix = '') =>
	getFieldsForPopulate(highlightPreviewFields, prefix)

export const highlightGroupPreviewFields = (settings: {
	prefix?: string
	dontAddFirstTag?: boolean
}) =>
	groupFieldsForAggregate(['_id', ...highlightPreviewFields], {
		prefix: settings.prefix,
		dontAddFirstTag: settings.dontAddFirstTag,
	})
