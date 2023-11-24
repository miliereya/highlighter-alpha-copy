/* eslint-disable @typescript-eslint/ban-types */
import { ApiException, DuplicateFieldException } from '..'
import { applyDecorators } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiCreatedResponse } from '@nestjs/swagger'

interface ApiCreateOptions {
	type: Type<unknown> | Function | [Function] | string
	document: string
	duplicateFields?: string[]
}

export const ApiCreate = (options: ApiCreateOptions) => {
	const { document, type, duplicateFields } = options
	if (duplicateFields) {
		ApiCreatedResponse({ type }), duplicateFields
		ApiException(() => BadRequestException, {
			description: duplicateFields.map((f) =>
				DuplicateFieldException(f, document)
			),
		})
	} else {
		return applyDecorators(ApiCreatedResponse({ type }))
	}
}
