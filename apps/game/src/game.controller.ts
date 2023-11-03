import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	HttpCode,
} from '@nestjs/common'
import { GameService } from './game.service'
import { CreateGameDto, UpdateGameDto } from './dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
	GAME_MESSAGE_PATTERNS,
	RemoveDeletedCategoryPayload,
} from '@app/common'

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post('create')
	create(@Body() createGameDto: CreateGameDto) {
		return this.gameService.create(createGameDto)
	}

	@Get(':_id')
	getById(@Param('_id') _id: string) {
		return this.gameService.findById(_id)
	}

	@Get('/by-slug/:slug')
	getBySlug(@Param('slug') slug: string) {
		return this.gameService.bySlug(slug)
	}

	@Get()
	getAll() {
		return this.gameService.findAll()
	}

	@Post('update/:_id')
	@HttpCode(200)
	update(@Param('_id') _id: string, @Body() updateGameDto: UpdateGameDto) {
		return this.gameService.update(_id, updateGameDto)
	}

	@Delete(':_id')
	remove(@Param('_id') _id: string) {
		this.gameService.delete(_id)
	}

	@MessagePattern(GAME_MESSAGE_PATTERNS.REMOVE_DELETED_CATEGORY)
	async removeDeletedCategory(@Payload() dto: RemoveDeletedCategoryPayload) {
		await this.gameService.removeDeletedCategory(dto)
	}
}
