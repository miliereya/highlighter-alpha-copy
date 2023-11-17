import { capitalizeAndSingularize } from '../../../common/src/utils'

export const DuplicateFieldException = (field: string, modelName: string) =>
	`Duplicate value in field '${field}' in ${capitalizeAndSingularize(
		modelName
	)} model`

export const DocumentNotFoundException = (modelName: string) =>
	`${capitalizeAndSingularize(modelName)} was not found`

export const InvalidIdException = (value?: any) =>
	value ? `Value: '${value}' should be id format` : 'Invalid id format'
