/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common/decorators'
import { UnauthorizedException } from '@nestjs/common/exceptions'
import { ApiException } from '..'
import { ApiCookieAuth } from '@nestjs/swagger'

export const ApiJwt = () => {
	return applyDecorators(
		ApiCookieAuth('Authentication'),
		...ApiException(() => UnauthorizedException, {
			description: 'Unauthorized',
		})
	)
}
