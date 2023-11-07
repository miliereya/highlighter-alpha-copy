/* eslint-disable @typescript-eslint/ban-types */
import { ApiException, DocumentNotFoundException } from '@app/common'
import { applyDecorators } from '@nestjs/common/decorators'
import { NotFoundException } from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiOkResponse, ApiParam } from '@nestjs/swagger'

interface ApiGetBySlugOptions {
	type: Type<unknown> | Function | [Function] | string
	document: string
	slug: string
}

export const ApiGetBySlug = (options: ApiGetBySlugOptions) => {
	const { document, type, slug } = options
	return applyDecorators(
		ApiOkResponse({ type }),
		ApiException(() => NotFoundException, {
			description: DocumentNotFoundException(document),
		}),
		ApiParam({ name: 'slug', required: true, example: slug })
	)
}
