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
	ApiCreate,
	ApiDelete,
	ApiGetById,
	ApiGetBySlug,
	ApiPatch,
	GAME_EXAMPLE,
	GAME_MESSAGE_PATTERNS,
	Game,
	RemoveDeletedCategoryPayload,
} from '@app/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiGetAll } from '@app/common/swagger/api-decorators/get-all.api-decorator'

@ApiTags('Public')
@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post('create')
	@ApiCreate({ document: Game.name, type: Game, duplicateFields: ['title'] })
	create(@Body() createGameDto: CreateGameDto) {
		return this.gameService.create(createGameDto)
	}

	@Get(':_id')
	@ApiGetById({ type: Game, document: Game.name })
	getById(@Param('_id') _id: string) {
		return this.gameService.findById(_id)
	}

	@Get('/by-slug/:slug')
	@ApiGetBySlug({ type: Game, document: Game.name, slug: GAME_EXAMPLE.slug })
	getBySlug(@Param('slug') slug: string) {
		return this.gameService.bySlug(slug)
	}

	@Get()
	@ApiGetAll({ type: Game })
	getAll() {
		return this.gameService.findAll()
	}

	@Patch('update/:_id')
	@ApiPatch({ type: Game, document: Game.name, duplicateFields: ['title'] })
	@HttpCode(200)
	update(@Param('_id') _id: string, @Body() updateGameDto: UpdateGameDto) {
		return this.gameService.update(_id, updateGameDto)
	}

	@Delete(':_id')
	@ApiDelete({ document: Game.name })
	delete(@Param('_id') _id: string) {
		this.gameService.delete(_id)
	}

	@MessagePattern(GAME_MESSAGE_PATTERNS.REMOVE_DELETED_CATEGORY)
	async removeDeletedCategory(@Payload() dto: RemoveDeletedCategoryPayload) {
		await this.gameService.removeDeletedCategory(dto)
	}
}
