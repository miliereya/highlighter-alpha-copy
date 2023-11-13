/* eslint-disable @typescript-eslint/ban-types */
import {
	ApiException,
	DocumentNotFoundException,
	DuplicateFieldException,
	InvalidIdException,
} from '..'
import { applyDecorators } from '@nestjs/common/decorators'
import {
	BadRequestException,
	NotFoundException,
} from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiCreatedResponse } from '@nestjs/swagger'

interface ApiPatchOptions {
	type: Type<unknown> | Function | [Function] | string
	document: string
	duplicateFields?: string[]
}

export const ApiPatch = (options: ApiPatchOptions) => {
	const { document, type, duplicateFields } = options

	const fields = duplicateFields
		? duplicateFields.map((f) => DuplicateFieldException(f, document))
		: []

	return applyDecorators(
		ApiCreatedResponse({ type }),
		ApiException(() => BadRequestException, {
			description: [InvalidIdException(), ...fields],
		}),
		ApiException(() => NotFoundException, {
			description: DocumentNotFoundException(document),
		})
	)
}
