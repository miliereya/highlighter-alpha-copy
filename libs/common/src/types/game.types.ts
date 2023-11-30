import { PickType } from '@nestjs/swagger'
import { Game } from '../models'
import { gamePreviewFields } from '../fields/game.fields'

export class GamePreview extends PickType(Game, gamePreviewFields) {}
