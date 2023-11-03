export function singularize(value: string) {
	const endings = {
		ves: 'fe',
		ies: 'y',
		i: 'us',
		zes: 'ze',
		ses: 's',
		es: 'e',
		s: '',
	}
	return value.replace(
		new RegExp(`(${Object.keys(endings).join('|')})$`),
		(r) => endings[r]
	)
}

export const capitalize = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

export const capitalizeAndSingularize = (value: string) =>
	capitalize(singularize(value))

export const toSlug = (value: string) => {
	return value
		.normalize('NFD') // split an accented letter in the base letter and the acent
		.replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 \-]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
		.replace(/\s+/g, '-') // separator
}
