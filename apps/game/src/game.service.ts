import { Inject, Injectable } from '@nestjs/common'
import { CreateGameDto, UpdateGameDto } from './dto'
import { GameRepository } from './game.repository'
import {
	CATEGORY_MESSAGE_PATTERNS,
	CATEGORY_SERVICE,
	RemoveDeletedCategoryPayload,
	RemoveDeletedGamePayload,
	parseToId,
	toSlug,
} from '@app/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class GameService {
	constructor(
		private readonly gameRepository: GameRepository,
		@Inject(CATEGORY_SERVICE) private readonly categoryService: ClientProxy
	) {}

	async create(dto: CreateGameDto) {
		return await this.gameRepository.create({
			...dto,
			categories: dto.categories.map(parseToId),
			slug: toSlug(dto.title),
		})
	}

	async findAll() {
		return await this.gameRepository.find()
	}

	async findById(_id: string) {
		return await this.gameRepository.findOne({ _id: parseToId(_id) })
	}

	async bySlug(slug: string) {
		return await this.gameRepository.findOne({ slug })
	}

	async update(_id: string, dto: UpdateGameDto) {
		return await this.gameRepository.findOneAndUpdate(
			{ _id: parseToId(_id) },
			{
				...dto,
				categories: dto.categories.map(parseToId),
				slug: toSlug(dto.title),
			}
		)
	}

	async removeDeletedCategory(dto: RemoveDeletedCategoryPayload) {
		const _id = parseToId(dto.categoryId)
		await this.gameRepository.updateMany(
			{ categories: _id },
			{ $pull: { categories: _id } }
		)
	}

	async delete(_id: string) {
		await this.gameRepository.findOneAndDelete({
			_id: parseToId(_id),
		})
		this.categoryService.emit<void, RemoveDeletedGamePayload>(
			CATEGORY_MESSAGE_PATTERNS.REMOVE_DELETED_GAME,
			{ gameId: _id }
		)
	}
}
