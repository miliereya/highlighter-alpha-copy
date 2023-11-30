import { ApiProperty, PickType } from '@nestjs/swagger'
import { Category } from '../models'
import { categoryPublicFields } from '../fields'
import { GamePreview } from './game.types'

export class CategoryPublic extends PickType(Category, categoryPublicFields) {
	@ApiProperty({ type: [GamePreview] })
	games: GamePreview[]
}
