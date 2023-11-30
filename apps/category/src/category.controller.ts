import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
	CATEGORY_MESSAGE_PATTERNS,
	Category,
	CreatorGuard,
	RemoveDeletedGamePayload,
} from '@app/common'
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiGetAll, CATEGORY_EXAMPLE } from '@app/api'
import { CategoryPublic } from '@app/common/types/category.types'

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get(':_id')
	@ApiOkResponse({ type: Category })
	getById(@Param('_id') _id: string) {
		return this.categoryService.findById(_id)
	}

	@Get()
	@ApiGetAll({ type: CategoryPublic })
	getAll() {
		return this.categoryService.findAll()
	}

	@Get('/by-slug/:slug')
	@ApiParam({ name: 'slug', required: true, example: CATEGORY_EXAMPLE.slug })
	@ApiOkResponse({ type: Category })
	getBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@CreatorGuard()
	@Post('create')
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.create(createCategoryDto)
	}

	@CreatorGuard()
	@Patch(':_id')
	@ApiOkResponse({ type: Category })
	@HttpCode(200)
	update(
		@Param('_id') _id: string,
		@Body() updateCategoryDto: UpdateCategoryDto
	) {
		return this.categoryService.update(_id, updateCategoryDto)
	}

	@CreatorGuard()
	@Delete(':_id')
	async delete(@Param('_id') _id: string) {
		await this.categoryService.delete(_id)
	}

	@MessagePattern(CATEGORY_MESSAGE_PATTERNS.REMOVE_DELETED_GAME)
	async removeDeletedGame(@Payload() dto: RemoveDeletedGamePayload) {
		await this.categoryService.removeDeletedGame(dto)
	}
}
