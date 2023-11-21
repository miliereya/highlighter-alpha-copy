/* eslint-disable @typescript-eslint/ban-types */
import { ApiException, DocumentNotFoundException } from '..'
import { applyDecorators } from '@nestjs/common/decorators'
import { NotFoundException } from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiOkResponse, ApiParam } from '@nestjs/swagger'

interface ApiGetOneOptions {
	type: Type<unknown> | Function | [Function] | string
	document: string
	example: string
	name: string
}

export const ApiGetOne = (options: ApiGetOneOptions) => {
	const { document, type, name, example } = options
	return applyDecorators(
		ApiOkResponse({ type }),
		ApiException(() => NotFoundException, {
			description: DocumentNotFoundException(document),
		}),
		ApiParam({ name, required: true, example })
	)
}
