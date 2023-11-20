/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common/decorators'
import { ApiJwt } from '..'
import { ApiOkResponse } from '@nestjs/swagger'
import { Type } from '@nestjs/common/interfaces'

interface ApiRefreshOptions {
	type?: Type<unknown> | Function | [Function] | string
}

export const ApiRefresh = (options?: ApiRefreshOptions) => {
	return applyDecorators(ApiJwt(), ApiOkResponse({ type: options.type }))
}
