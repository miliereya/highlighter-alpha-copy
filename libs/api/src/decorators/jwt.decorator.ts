/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common/decorators'
import { ForbiddenException } from '@nestjs/common/exceptions'
import { ApiException } from '..'

export const ApiJwt = () => {
	return applyDecorators(
		ApiException(() => ForbiddenException, {
			description: 'Forbidden resource',
		})
	)
}
