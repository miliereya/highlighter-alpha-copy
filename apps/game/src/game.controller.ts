import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	HttpCode,
	Patch,
} from '@nestjs/common'
import { GameService } from './game.service'
import { CreateGameDto, UpdateGameDto } from './dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
	CreatorGuard,
	GAME_MESSAGE_PATTERNS,
	Game,
	RemoveDeletedCategoryPayload,
} from '@app/common'
import { ApiTags } from '@nestjs/swagger'
import {
	ApiCreate,
	ApiDelete,
	ApiGetAll,
	ApiGetById,
	ApiGetOne,
	ApiPatch,
	GAME_EXAMPLE,
} from '@app/api'

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post('create')
	@CreatorGuard()
	@ApiCreate({ document: Game.name, type: Game, duplicateFields: ['title'] })
	create(@Body() createGameDto: CreateGameDto) {
		return this.gameService.create(createGameDto)
	}

	@Get(':_id')
	@ApiTags('Public')
	@ApiGetById({ type: Game, document: Game.name })
	getById(@Param('_id') _id: string) {
		return this.gameService.findById(_id)
	}

	@Get('/by-slug/:slug')
	@ApiTags('Public')
	@ApiGetOne({
		type: Game,
		document: Game.name,
		example: GAME_EXAMPLE.slug,
		name: 'slug',
	})
	getBySlug(@Param('slug') slug: string) {
		return this.gameService.bySlug(slug)
	}

	@Get()
	@ApiTags('Public')
	@ApiGetAll({ type: Game })
	getAll() {
		return this.gameService.findAll()
	}

	@Patch('update/:_id')
	@CreatorGuard()
	@ApiPatch({ type: Game, document: Game.name, duplicateFields: ['title'] })
	@HttpCode(200)
	update(@Param('_id') _id: string, @Body() updateGameDto: UpdateGameDto) {
		return this.gameService.update(_id, updateGameDto)
	}

	@Delete(':_id')
	@CreatorGuard()
	@ApiDelete({ document: Game.name })
	delete(@Param('_id') _id: string) {
		this.gameService.delete(_id)
	}

	@MessagePattern(GAME_MESSAGE_PATTERNS.REMOVE_DELETED_CATEGORY)
	async removeDeletedCategory(@Payload() dto: RemoveDeletedCategoryPayload) {
		await this.gameService.removeDeletedCategory(dto)
	}
}
