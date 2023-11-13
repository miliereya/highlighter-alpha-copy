import { HttpException, Type } from '@nestjs/common'
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger'
export type Func = () => void

export interface ApiExceptionOptions {
	description: string | string[]
}

export const ApiException = <T extends HttpException>(
	exception: () => Type<T>,
	options: ApiExceptionOptions
): MethodDecorator & ClassDecorator => {
	const instance = new (exception())()
	const description = options.description

	const apiResponseOptions: ApiResponseOptions = {
		status: instance.getStatus(),
		content: {},
	}

	if (Array.isArray(description)) {
		for (let i = 0; i < description.length; i++) {
			const de = description[i]
			apiResponseOptions.content[de] = {
				schema: {
					type: 'object',
					properties: {
						statusCode: {
							type: 'number',
							example: instance.getStatus(),
						},
						message: {
							type: 'string',
							example: de,
						},
						error: {
							type: 'string',
							example: instance.message,
						},
					},
					required: ['statusCode', 'message'],
				},
			}
		}
	} else {
		apiResponseOptions.content[description] = {
			schema: {
				type: 'object',
				properties: {
					statusCode: {
						type: 'number',
						example: instance.getStatus(),
					},
					message: {
						type: 'string',
						example: description,
					},
					error: {
						type: 'string',
						example: instance.message,
					},
				},
				required: ['statusCode', 'message'],
			},
		}
	}
	return ApiResponse(apiResponseOptions)
}
