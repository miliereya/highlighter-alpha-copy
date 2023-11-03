import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	MaxLength,
	MinLength,
} from 'class-validator'

export class LoginDto {
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	username: string

	@IsStrongPassword({ minLength: 8 })
	password: string
}

export class RegisterDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(3, { message: 'username cannot be less than 3 characters' })
	@MaxLength(24, {
		message: 'Password cannot be more than 24 characters',
	})
	username: string

	@IsString()
	@MinLength(8, { message: 'Password cannot be less than 6 characters' })
	@MaxLength(24, {
		message: 'Password cannot be more than 24 characters',
	})
	password: string
}
