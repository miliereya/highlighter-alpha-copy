/* eslint-disable @typescript-eslint/ban-types */
import { ApiException } from '..'
import { applyDecorators } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'
import { ApiOkResponse } from '@nestjs/swagger'

export const ApiConfirmEmail = () => {
	return applyDecorators(
		ApiOkResponse(),
		...ApiException(() => BadRequestException, {
			description: [
				'Email already confirmed',
				'Email confirmation token expired',
				'Invalid confirmation token',
			],
		})
	)
}
