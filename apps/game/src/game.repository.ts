import { Injectable, Logger } from '@nestjs/common'
import { AbstractRepository, Game } from '@app/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class GameRepository extends AbstractRepository<Game> {
	protected readonly logger = new Logger(GameRepository.name)

	constructor(
		@InjectModel(Game.name)
		gameModel: Model<Game>
	) {
		super(gameModel)
	}
}
