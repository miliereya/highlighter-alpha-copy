import { IsNotEmpty, IsString } from 'class-validator'

export class GetUserDto {
	@IsString()
	@IsNotEmpty()
	_id: string
}

export class ConfirmEmailDto {
	@IsString()
	@IsNotEmpty()
	token: string
}
