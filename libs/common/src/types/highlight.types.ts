import { _id } from '.'
import { highlightPreviewFields } from '../fields'
import { Highlight } from '../models'

type TypeHighlightPreviewFields = (typeof highlightPreviewFields)[number]

export interface HighlightPublic
	extends Pick<Highlight, TypeHighlightPreviewFields>,
		_id {}
