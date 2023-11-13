import { PickType } from '@nestjs/swagger'
import { highlightPreviewFields } from '../fields'
import { Highlight } from '../models'

export class HighlightPreview extends PickType(
	Highlight,
	highlightPreviewFields
) {}
