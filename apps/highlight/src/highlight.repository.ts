import { Injectable, Logger } from '@nestjs/common'
import { AbstractRepository, Highlight } from '@app/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class HighlightRepository extends AbstractRepository<Highlight> {
	protected readonly logger = new Logger(HighlightRepository.name)

	constructor(
		@InjectModel(Highlight.name)
		highlightModel: Model<Highlight>
	) {
		super(highlightModel)
	}
}
