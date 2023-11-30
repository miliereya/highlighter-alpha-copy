import { Inject, Injectable } from '@nestjs/common'
import { CategoryRepository } from './category.repository'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import {
	AddCategoryToGamesPayload,
	GAME_MESSAGE_PATTERNS,
	GAME_SERVICE,
	MONGO_COLLECTIONS,
	RemoveDeletedCategoryPayload,
	RemoveDeletedGamePayload,
	categoryPublicFields,
	getFieldsForProject,
	parseToId,
	toSlug,
} from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import { gamePreviewFields } from '@app/common/fields/game.fields'
import { CategoryPublic } from '@app/common/types/category.types'

@Injectable()
export class CategoryService {
	constructor(
		private readonly categoryRepository: CategoryRepository,
		@Inject(GAME_SERVICE) private readonly gameService: ClientProxy
	) {}
	async create(dto: CreateCategoryDto) {
		return await this.categoryRepository.create({
			...dto,
			slug: toSlug(dto.title),
			games: parseToId(dto.games),
		})
	}

	async findAll() {
		return await this.categoryRepository.aggregate<CategoryPublic>([
			{
				$lookup: {
					from: MONGO_COLLECTIONS.GAMES,
					localField: 'games',
					foreignField: '_id',
					as: 'games',
				},
			},
			{
				$project: {
					...getFieldsForProject(categoryPublicFields),
					games: getFieldsForProject(gamePreviewFields),
				},
			},
		])
	}

	async findById(_id: string) {
		return await this.categoryRepository.findOne({ _id: parseToId(_id) })
	}

	async bySlug(slug: string) {
		return await this.categoryRepository.findOne({ slug })
	}

	async update(_id: string, dto: UpdateCategoryDto) {
		const category = await this.categoryRepository.findOneAndUpdate(
			{ _id: parseToId(_id) },
			{ ...dto, games: dto.games.map(parseToId), slug: toSlug(dto.title) }
		)
		this.gameService.emit<void, AddCategoryToGamesPayload>(
			GAME_MESSAGE_PATTERNS.ADD_CATEGORY_TO_GAMES,
			{
				gameIds: dto.games,
				categoryId: category._id,
			}
		)
		return category
	}

	async removeDeletedGame(dto: RemoveDeletedGamePayload) {
		const gameId = parseToId(dto.gameId)
		await this.categoryRepository.updateMany(
			{ games: gameId },
			{ $pull: { games: gameId } }
		)
	}

	async delete(_id: string) {
		await this.categoryRepository.findOneAndDelete({
			_id: parseToId(_id),
		})
		this.gameService.emit<void, RemoveDeletedCategoryPayload>(
			GAME_MESSAGE_PATTERNS.REMOVE_DELETED_CATEGORY,
			{
				categoryId: _id,
			}
		)
	}
}
