import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	description: string

	@IsString()
	@IsNotEmpty()
	icon: string

	@IsArray()
	games: string[]
}
