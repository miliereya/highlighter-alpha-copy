import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
	CATEGORY_MESSAGE_PATTERNS,
	RemoveDeletedGamePayload,
} from '@app/common'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post('create')
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.create(createCategoryDto)
	}

	@Get(':_id')
	getById(@Param('_id') _id: string) {
		return this.categoryService.findById(_id)
	}

	@Get()
	getAll() {
		return this.categoryService.findAll()
	}

	@Get('/by-slug/:slug')
	getBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@Post(':_id')
	@HttpCode(200)
	update(
		@Param('_id') _id: string,
		@Body() updateCategoryDto: UpdateCategoryDto
	) {
		return this.categoryService.update(_id, updateCategoryDto)
	}

	@Delete(':_id')
	async remove(@Param('_id') _id: string) {
		await this.categoryService.delete(_id)
	}

	@MessagePattern(CATEGORY_MESSAGE_PATTERNS.REMOVE_DELETED_GAME)
	async removeDeletedGame(@Payload() dto: RemoveDeletedGamePayload) {
		await this.categoryService.removeDeletedGame(dto)
	}
}
