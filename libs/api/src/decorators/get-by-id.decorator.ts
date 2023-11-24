/* eslint-disable @typescript-eslint/ban-types */
import { ApiException, DocumentNotFoundException, InvalidIdException } from '..'
import { applyDecorators } from '@nestjs/common/decorators'
import {
	BadRequestException,
	NotFoundException,
} from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiOkResponse } from '@nestjs/swagger'

interface ApiGetByIdOptions {
	type: Type<unknown> | Function | [Function] | string
	document: string
}

export const ApiGetById = (options: ApiGetByIdOptions) => {
	const { document, type } = options
	return applyDecorators(
		ApiOkResponse({ type }),
		...ApiException(() => BadRequestException, {
			description: InvalidIdException(),
		}),
		...ApiException(() => NotFoundException, {
			description: DocumentNotFoundException(document),
		})
	)
}
