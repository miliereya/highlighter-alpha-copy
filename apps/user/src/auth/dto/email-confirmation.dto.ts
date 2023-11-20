import { USER_EXAMPLE } from '@app/api'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ConfirmEmailDto {
	@ApiProperty({
		type: String,
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pbGllcmV5YTMyQGdtYWlsLmNvbSIsImlhdCI6MTcwMDM4MDk5MCwiZXhwIjoxNzAwNDAyNTkwfQ.JRXmTD5nCahrZi0cYRVtcQsMRnE2m9sKmVk6c-FbGuI',
	})
	@IsString()
	@IsNotEmpty()
	token: string
}

export class ResendConfirmEmailDto {
	@ApiProperty({
		type: String,
		example: USER_EXAMPLE.email,
	})
	@IsEmail()
	email: string
}
