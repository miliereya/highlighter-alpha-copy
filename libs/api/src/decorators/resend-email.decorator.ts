/* eslint-disable @typescript-eslint/ban-types */
import { ApiException } from '..'
import { applyDecorators } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'
import { ApiOkResponse } from '@nestjs/swagger'

export const ApiResendEmail = () => {
	return applyDecorators(
		ApiOkResponse(),
		ApiException(() => BadRequestException, {
			description: ['Email already confirmed'],
		})
	)
}
