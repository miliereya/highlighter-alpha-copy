import { Inject, Injectable } from '@nestjs/common'
import { CreateGameDto, UpdateGameDto } from './dto'
import { GameRepository } from './game.repository'
import {
	AddCategoryToGamesPayload,
	CATEGORY_MESSAGE_PATTERNS,
	CATEGORY_SERVICE,
	RemoveDeletedCategoryPayload,
	RemoveDeletedGamePayload,
	parseToId,
	toSlug,
} from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import { AmazonS3Service } from '@app/amazon-s3'

@Injectable()
export class GameService {
	constructor(
		private readonly gameRepository: GameRepository,
		private readonly amazonS3Service: AmazonS3Service,
		@Inject(CATEGORY_SERVICE) private readonly categoryService: ClientProxy
	) {}

	async create(file: Buffer, dto: CreateGameDto) {
		const slug = toSlug(dto.title)
		const icon = `${slug}`

		const game = await this.gameRepository.create({
			...dto,
			icon: icon,
			categories: parseToId(dto.categories),
			slug,
		})
		await this.amazonS3Service.upload(icon, file)

		return game
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

	async addCategoryToGames(dto: AddCategoryToGamesPayload) {
		await this.gameRepository.updateMany(
			{
				_id: { $in: parseToId(dto.gameIds) },
				categories: { $ne: parseToId(dto.categoryId) },
			},
			{ $push: { categories: parseToId(dto.categoryId) } }
		)

		await this.gameRepository.updateMany(
			{
				_id: { $nin: parseToId(dto.gameIds) },
				categories: { $in: parseToId(dto.categoryId) },
			},
			{ $pull: { categories: parseToId(dto.categoryId) } }
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
