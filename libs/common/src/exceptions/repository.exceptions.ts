import { capitalizeAndSingularize } from '../utils'

export const DuplicateFieldException = (field: string, modelName: string) =>
	`Duplicate value in field '${field}' in ${capitalizeAndSingularize(
		modelName
	)} model`

export const DocumentNotFoundException = (modelName: string) =>
	`${capitalizeAndSingularize(modelName)} was not found`

export const InvalidIdException = () => 'Invalid id format'
