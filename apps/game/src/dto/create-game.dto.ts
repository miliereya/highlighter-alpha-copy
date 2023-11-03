import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateGameDto {
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
	categories: string[]
}
