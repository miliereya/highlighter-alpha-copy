/* eslint-disable @typescript-eslint/ban-types */
import {
	ApiException,
	DocumentNotFoundException,
	InvalidIdException,
} from '@app/common'
import { applyDecorators } from '@nestjs/common/decorators'
import {
	BadRequestException,
	NotFoundException,
} from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiOkResponse } from '@nestjs/swagger'

interface ApiDeleteOptions {
	type?: Type<unknown> | Function | [Function] | string
	document: string
}

export const ApiDelete = (options: ApiDeleteOptions) => {
	const { type, document } = options
	return applyDecorators(
		ApiOkResponse({ type }),
		ApiException(() => NotFoundException, {
			description: DocumentNotFoundException(document),
		}),
		ApiException(() => BadRequestException, {
			description: InvalidIdException(),
		})
	)
}
