/* eslint-disable @typescript-eslint/ban-types */
import { ApiException } from '@app/common'
import { applyDecorators } from '@nestjs/common/decorators'
import { ForbiddenException } from '@nestjs/common/exceptions'

export const ApiJwt = () => {
	return applyDecorators(
		ApiException(() => ForbiddenException, {
			description: 'Forbidden resource',
		})
	)
}
