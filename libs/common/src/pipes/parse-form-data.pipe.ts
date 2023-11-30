import { PipeTransform } from '@nestjs/common/interfaces'

type TParseFormDataJsonOptions = {
	field: string
}

export class ParseFormDataJsonPipe implements PipeTransform {
	constructor(private options?: TParseFormDataJsonOptions) {}

	transform(value: any) {
		const { field } = this.options
		const jsonField = value[field].replace(
			/(\w+:)|(\w+ :)/g,
			function (matchedStr: string) {
				return (
					'"' + matchedStr.substring(0, matchedStr.length - 1) + '":'
				)
			}
		)
		return JSON.parse(jsonField)
	}
}
