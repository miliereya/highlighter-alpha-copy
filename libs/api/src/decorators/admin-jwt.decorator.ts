/* eslint-disable @typescript-eslint/ban-types */
import { ApiException } from '..'
import { applyDecorators } from '@nestjs/common/decorators'
import { ForbiddenException } from '@nestjs/common/exceptions'

export const ApiAdminJwt = () => {
	return applyDecorators(
		...ApiException(() => ForbiddenException, {
			description: 'Forbidden resource',
		})
	)
}
