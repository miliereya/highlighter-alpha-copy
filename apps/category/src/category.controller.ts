import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
	ApiException,
	CATEGORY_MESSAGE_PATTERNS,
	DocumentNotFoundException,
	DuplicateFieldException,
	InvalidIdException,
	RemoveDeletedGamePayload,
} from '@app/common'
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger'
import { Category } from './models/category.schema'
import { CATEGORY_EXAMPLE } from './constants'

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get(':_id')
	@ApiOkResponse({ type: Category })
	@ApiException(() => BadRequestException, {
		description: InvalidIdException(),
	})
	@ApiException(() => NotFoundException, {
		description: DocumentNotFoundException(Category.name),
	})
	getById(@Param('_id') _id: string) {
		return this.categoryService.findById(_id)
	}

	@Get()
	@ApiOkResponse({ type: [Category] })
	getAll() {
		return this.categoryService.findAll()
	}

	@Get('/by-slug/:slug')
	@ApiNotFoundResponse({
		description: DocumentNotFoundException(Category.name),
	})
	@ApiParam({ name: 'slug', required: true, example: CATEGORY_EXAMPLE.slug })
	@ApiOkResponse({ type: Category })
	getBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@Post('create')
	@ApiCreatedResponse({ type: Category })
	@ApiBadRequestResponse({
		description: DuplicateFieldException('title', Category.name),
	})
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.create(createCategoryDto)
	}

	@Post(':_id')
	@ApiOkResponse({ type: Category })
	@ApiException(() => NotFoundException, {
		description: DocumentNotFoundException(Category.name),
	})
	@ApiException(() => BadRequestException, {
		description: [
			DuplicateFieldException('title', Category.name),
			InvalidIdException(),
		],
	})
	@HttpCode(200)
	update(
		@Param('_id') _id: string,
		@Body() updateCategoryDto: UpdateCategoryDto
	) {
		return this.categoryService.update(_id, updateCategoryDto)
	}

	@Delete(':_id')
	@ApiOkResponse()
	@ApiNotFoundResponse({
		description: DocumentNotFoundException(Category.name),
	})
	// @ApiException(() => BadRequestException, {
	// 	description: InvalidIdException(),
	// })
	async remove(@Param('_id') _id: string) {
		await this.categoryService.delete(_id)
	}

	@MessagePattern(CATEGORY_MESSAGE_PATTERNS.REMOVE_DELETED_GAME)
	async removeDeletedGame(@Payload() dto: RemoveDeletedGamePayload) {
		await this.categoryService.removeDeletedGame(dto)
	}
}
