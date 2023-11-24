import { HttpException, Type } from '@nestjs/common'
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger'
export type Func = () => void

export interface ApiExceptionOptions {
	description: string | (string | string[])[]
}

export const ApiException = <T extends HttpException>(
	exception: () => Type<T>,
	options: ApiExceptionOptions
): (MethodDecorator & ClassDecorator)[] => {
	const instance = new (exception())()
	const description = options.description

	if (Array.isArray(description)) {
		const res: ApiResponseOptions[] = []
		for (let i = 0; i < description.length; i++) {
			const de = description[i]
			const apiResponseOptions: ApiResponseOptions = {
				status: `${instance.getStatus()} (${i + 1})` as any,
				content: {},
				isArray: true,
			}
			apiResponseOptions.content['application/json'] = {
				schema: {
					type: 'object',
					properties: {
						statusCode: {
							type: 'number',
							example: instance.getStatus(),
						},
						message: {
							type: Array.isArray(de) ? 'array' : 'string',
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
			res.push(apiResponseOptions)
		}
		return res.map((r) => ApiResponse(r))
	} else {
		const apiResponseOptions: ApiResponseOptions = {
			status: instance.getStatus(),
			content: {},
		}
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
		return [ApiResponse(apiResponseOptions)]
	}
}
