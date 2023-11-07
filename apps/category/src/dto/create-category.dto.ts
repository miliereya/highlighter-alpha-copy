import { CATEGORY_EXAMPLE } from '@app/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryDto {
	@ApiProperty({ type: String, example: CATEGORY_EXAMPLE.title })
	@IsString()
	@IsNotEmpty()
	title: string

	@ApiProperty({
		type: String,
		example: CATEGORY_EXAMPLE.description,
	})
	@IsString()
	@IsNotEmpty()
	description: string

	@ApiProperty({
		type: [String],
		example: CATEGORY_EXAMPLE.games,
	})
	@IsArray()
	games: string[]
}
