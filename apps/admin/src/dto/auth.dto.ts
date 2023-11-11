import { TypeAdminRole } from '@app/common'
import {
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	MaxLength,
	MinLength,
} from 'class-validator'

export class LoginDto {
	@IsNotEmpty()
	@IsString()
	username: string

	@IsStrongPassword({ minLength: 8 })
	password: string
}

export class RegisterDto {
	@IsString()
	@MinLength(3, { message: 'username cannot be less than 3 characters' })
	@MaxLength(24, {
		message: 'Password cannot be more than 24 characters',
	})
	username: string

	@IsString()
	@IsNotEmpty()
	role: TypeAdminRole

	@IsString()
	@MinLength(8, { message: 'Password cannot be less than 6 characters' })
	@MaxLength(24, {
		message: 'Password cannot be more than 24 characters',
	})
	password: string
}
