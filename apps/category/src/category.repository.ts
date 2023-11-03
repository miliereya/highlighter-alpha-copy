import { Injectable, Logger } from '@nestjs/common'
import { AbstractRepository } from '@app/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category } from './models/category.schema'

@Injectable()
export class CategoryRepository extends AbstractRepository<Category> {
	protected readonly logger = new Logger(CategoryRepository.name)

	constructor(
		@InjectModel(Category.name)
		categoryModel: Model<Category>
	) {
		super(categoryModel)
	}
}
