import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateHighlightDto {
	@IsString()
	@MaxLength(255)
	title: string

	@IsNotEmpty()
	@IsString()
	game: string
}
