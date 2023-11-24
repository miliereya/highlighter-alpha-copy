/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common/decorators'
import { UnauthorizedException } from '@nestjs/common/exceptions'
import { ApiException } from '..'
import { ApiBearerAuth } from '@nestjs/swagger'

export const ApiJwt = () => {
	return applyDecorators(
		ApiBearerAuth(),
		...ApiException(() => UnauthorizedException, {
			description: 'Unauthorized',
		})
	)
}
