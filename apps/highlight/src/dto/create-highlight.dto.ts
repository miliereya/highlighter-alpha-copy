import {
	IsArray,
	IsNotEmpty,
	IsString,
	MaxLength,
	ArrayMaxSize,
} from 'class-validator'

export class CreateHighlightDto {
	@IsString()
	@MaxLength(255)
	title: string

	@IsArray()
	@ArrayMaxSize(10)
	content: string[]

	@IsNotEmpty()
	@IsString()
	game: string
}
