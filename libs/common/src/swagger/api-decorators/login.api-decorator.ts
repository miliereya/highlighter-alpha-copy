/* eslint-disable @typescript-eslint/ban-types */
import { ApiException } from '@app/common'
import { applyDecorators } from '@nestjs/common/decorators'
import { UnauthorizedException } from '@nestjs/common/exceptions'
import { Type } from '@nestjs/common/interfaces'
import { ApiOkResponse } from '@nestjs/swagger'

interface ApiLoginOptions {
	type?: Type<unknown> | Function | [Function] | string
}

export const ApiLogin = (options: ApiLoginOptions = { type: undefined }) => {
	const { type } = options
	return applyDecorators(
		ApiOkResponse({ type }),
		ApiException(() => UnauthorizedException, {
			description: ['Credentials are not valid'],
		})
	)
}
