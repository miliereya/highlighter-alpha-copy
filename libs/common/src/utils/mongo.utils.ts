import { InvalidIdException } from '@app/api'
import { BadRequestException } from '@nestjs/common/exceptions'
import { Types } from 'mongoose'

export const parseToId = (value: string | number | Types.ObjectId) => {
	try {
		return new Types.ObjectId(value)
	} catch (e) {
		throw new BadRequestException(InvalidIdException())
	}
}

export const getFieldsForProject = (fields: string[], prefix: string = '') => {
	if (prefix) prefix = prefix + '.'
	const fieldsToReturn = {}
	for (let i = 0; i < fields.length; i++) {
		fieldsToReturn[prefix + fields[i]] = 1
	}
	return fieldsToReturn
}

export const groupFieldsForAggregate = (
	fields: string[],
	settings?: {
		prefix?: string
		dontAddFirstTag?: boolean
	}
) => {
	let prefix = ''
	let dontAddFirstTag = false
	if (settings) {
		if (settings.prefix) prefix = settings.prefix + '.'
		if (settings.dontAddFirstTag) dontAddFirstTag = settings.dontAddFirstTag
	}
	const fieldsToReturn = {}
	for (let i = 0; i < fields.length; i++) {
		fieldsToReturn[fields[i]] =
			fields[i] === '_id' || dontAddFirstTag
				? `$${prefix + fields[i]}`
				: {
						$first: `$${prefix + fields[i]}`,
				  }
	}
	return fieldsToReturn
}

export const getFieldsForSelect = (fields: string[], prefix: string = '') => {
	if (prefix) prefix = prefix + '.'
	return fields
		.reduce((acc, field) => acc + prefix + field + ' ', '')
		.slice(0, -1)
}
