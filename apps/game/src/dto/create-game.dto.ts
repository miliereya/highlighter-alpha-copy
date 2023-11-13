import { GAME_EXAMPLE } from '@app/api'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateGameDto {
	@ApiProperty({ type: String, example: GAME_EXAMPLE.title })
	@IsString()
	@IsNotEmpty()
	title: string

	@ApiProperty({
		type: String,
		example: GAME_EXAMPLE.description,
	})
	@IsString()
	@IsNotEmpty()
	description: string

	@ApiProperty({
		type: String,
		example: GAME_EXAMPLE.icon,
	})
	@IsString()
	@IsNotEmpty()
	icon: string

	@ApiProperty({
		type: [String],
		example: GAME_EXAMPLE.categories,
	})
	@IsArray()
	categories: string[]
}
