/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common/decorators'
import { UnauthorizedException } from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ApiException } from '../exceptions'

interface ApiLoginOptions {
	type?: Type<unknown> | Function | [Function] | string
}

export const ApiLogin = (options: ApiLoginOptions = { type: undefined }) => {
	const { type } = options
	return applyDecorators(
		ApiTags('Authentication'),
		ApiOkResponse({ type }),
		ApiException(() => UnauthorizedException, {
			description: ['Credentials are not valid'],
		})
	)
}
