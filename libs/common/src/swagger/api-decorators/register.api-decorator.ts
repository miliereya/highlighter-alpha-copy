/* eslint-disable @typescript-eslint/ban-types */
import { ApiException } from '@app/common'
import { applyDecorators } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiCreatedResponse } from '@nestjs/swagger'

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
