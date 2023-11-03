import { MONGO_COLLECTIONS } from '@app/common/constants'
import { highlightAggregatePreviewFields } from '.'

export const highlightPreviewLookup = (localField = 'highlights') => ({
	from: MONGO_COLLECTIONS.HIGHLIGHTS,
	localField,
	foreignField: '_id',
	as: 'highlights',
	pipeline: [
		{
			$project: {
				...highlightAggregatePreviewFields(),
				comments: { $size: '$comments' },
			},
		},
	],
})
