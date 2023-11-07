/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common/decorators'
import { Type } from '@nestjs/common/interfaces'
import { ApiOkResponse } from '@nestjs/swagger'

interface ApiGetAllOptions {
	type: Type<unknown> | Function
}

export const ApiGetAll = (options: ApiGetAllOptions) => {
	const { type } = options
	return applyDecorators(ApiOkResponse({ type: [type] }))
}
