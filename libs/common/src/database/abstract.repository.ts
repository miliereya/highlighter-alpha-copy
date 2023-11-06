import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import {
	AggregateOptions,
	FilterQuery,
	Model,
	PipelineStage,
	ProjectionType,
	Types,
	UpdateQuery,
} from 'mongoose'
import { AbstractDocument } from './abstract.schema'
import { capitalizeAndSingularize } from '../utils'
import {
	DocumentNotFoundException,
	DuplicateFieldException,
} from '../exceptions'

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
	protected abstract readonly logger: Logger

	constructor(protected readonly model: Model<TDocument>) {}

	async aggregate(
		pipelineStages: PipelineStage[],
		options: AggregateOptions
	): Promise<TDocument[]> {
		const documents = await this.model.aggregate<TDocument>(
			pipelineStages,
			options
		)

		return documents
	}

	async aggregateOne(
		pipelineStages: PipelineStage[],
		options?: AggregateOptions
	): Promise<TDocument> {
		const documents = await this.model.aggregate<TDocument>(
			pipelineStages,
			options
		)

		if (!documents[0]) {
			throw new NotFoundException(
				DocumentNotFoundException(this.model.collection.collectionName)
			)
		}

		return documents[0]
	}

	async create(
		document: Omit<Partial<TDocument>, '_id'>
	): Promise<TDocument> {
		try {
			const createdDocument = new this.model({
				...document,
				_id: new Types.ObjectId(),
			})
			return (
				await createdDocument.save()
			).toJSON() as unknown as TDocument
		} catch (e) {
			if (e.code === 11000) {
				throw new BadRequestException(
					DuplicateFieldException(
						e.message.split('{ ').pop().split(':')[0],
						this.model.collection.collectionName
					)
				)
			}
		}
	}

	async findOne(
		filterQuery: FilterQuery<TDocument>,
		fields?: ProjectionType<TDocument>
	) {
		const document = await this.model.findOne(filterQuery, fields)
		if (!document) {
			throw new NotFoundException(
				`${capitalizeAndSingularize(
					this.model.collection.collectionName
				)} was not found`
			)
		}

		return document
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<TDocument>,
		update: UpdateQuery<TDocument>
	): Promise<TDocument> {
		try {
			const document = await this.model
				.findOneAndUpdate(filterQuery, update, {
					new: true,
				})
				.lean<TDocument>(true)

			if (!document) {
				throw { code: 404 }
			}

			return document
		} catch (e) {
			if (e.code === 11000) {
				throw new BadRequestException(
					`Duplicate value in field '${
						e.message.split('{ ').pop().split(':')[0]
					}' in ${capitalizeAndSingularize(
						this.model.collection.collectionName
					)} model`
				)
			} else if (e.code === 404) {
				throw new NotFoundException(
					`${capitalizeAndSingularize(
						this.model.collection.collectionName
					)} was not found`
				)
			}
		}
	}

	async find(filterQuery: FilterQuery<TDocument> = {}): Promise<TDocument[]> {
		return this.model.find(filterQuery).lean<TDocument[]>(true)
	}

	async updateMany(
		filterQuery: FilterQuery<TDocument>,
		update: UpdateQuery<TDocument>
	) {
		try {
			await this.model.updateMany(filterQuery, update, {
				new: true,
			})
		} catch (e) {
			if (e.code === 11000) {
				throw new BadRequestException(
					`Duplicate value in field '${
						e.message.split('{ ').pop().split(':')[0]
					}' in ${capitalizeAndSingularize(
						this.model.collection.collectionName
					)} model`
				)
			}
		}
	}

	async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
		const document = await this.model
			.findOneAndDelete(filterQuery)
			.lean<TDocument>(true)
		if (!document) {
			throw new NotFoundException(
				`${capitalizeAndSingularize(
					this.model.collection.collectionName
				)} was not found`
			)
		}
	}
}
