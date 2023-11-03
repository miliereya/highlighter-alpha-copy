import { Injectable, Logger } from '@nestjs/common'
import { AbstractRepository } from '@app/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Highlight } from './models/highlight.schema'

@Injectable()
export class HighlightRepository extends AbstractRepository<Highlight> {
	protected readonly logger = new Logger(HighlightRepository.name)

	constructor(
		@InjectModel(Highlight.name)
		reservationModel: Model<Highlight>
	) {
		super(reservationModel)
	}
}
