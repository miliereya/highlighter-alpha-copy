import { USER_EXAMPLE } from '@app/api'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
	@ApiProperty({ type: String, example: USER_EXAMPLE.email })
	@IsEmail()
	email: string

	@ApiProperty({
		type: String,
		minLength: 8,
		maxLength: 24,
		example: USER_EXAMPLE.password,
	})
	@IsString()
	@MinLength(8, { message: 'Password cannot be less than 8 characters' })
	@MaxLength(24, {
		message: 'Password cannot be more than 24 characters',
	})
	password: string
}

export class RegisterDto {
	@ApiProperty({ type: String, example: USER_EXAMPLE.email })
	@IsEmail()
	email: string

	@ApiProperty({
		type: String,
		minLength: 3,
		maxLength: 24,
		example: USER_EXAMPLE.username,
	})
	@IsString()
	@MinLength(3, { message: 'username cannot be less than 3 characters' })
	@MaxLength(24, {
		message: 'Password cannot be more than 24 characters',
	})
	username: string

	@ApiProperty({
		type: String,
		minLength: 8,
		maxLength: 24,
		example: USER_EXAMPLE.password,
	})
	@IsString()
	@MinLength(8, { message: 'Password cannot be less than 8 characters' })
	@MaxLength(24, {
		message: 'Password cannot be more than 24 characters',
	})
	password: string
}
