/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiCreatedResponse } from '@nestjs/swagger'
import { ApiException } from '../exceptions'

interface ApiRegisterOptions {
	type?: Type<unknown> | Function | [Function] | string
}

export const ApiRegister = (
	options: ApiRegisterOptions = { type: undefined }
) => {
	const { type } = options
	return applyDecorators(
		ApiCreatedResponse({ type }),
		ApiException(() => BadRequestException, {
			description: [
				'Email is already used.',
				'Username is already used.',
			],
		})
	)
}
