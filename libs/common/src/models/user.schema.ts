import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, MONGO_COLLECTIONS } from '@app/common'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { USER_EXAMPLE } from '@app/api'

@Schema({ versionKey: false })
export class User extends AbstractDocument {
	@ApiProperty({ type: String, example: USER_EXAMPLE.email })
	@Prop({ unique: true })
	email: string

	@Prop({ default: false })
	isEmailConfirmed: boolean

	@ApiProperty({ type: String, example: USER_EXAMPLE.username })
	@Prop({ unique: true, minlength: 3, maxlength: 24 })
	username: string

	@Prop()
	password: string

	@ApiProperty({ type: String, example: '' })
	@Prop({ default: '' })
	avatar: string

	@ApiProperty({ type: [String], example: USER_EXAMPLE.highlights })
	@Prop({ ref: MONGO_COLLECTIONS.HIGHLIGHTS, default: [] })
	highlights: Types.ObjectId[]

	@ApiProperty({ type: String, example: USER_EXAMPLE.likedHighlights })
	@Prop({ ref: MONGO_COLLECTIONS.HIGHLIGHTS, default: [] })
	likedHighlights: Types.ObjectId[]

	@ApiProperty({ type: String, example: USER_EXAMPLE.subscribers })
	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	subscribers: Types.ObjectId[]

	@ApiProperty({ type: String, example: USER_EXAMPLE.subscribed })
	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	subscribed: Types.ObjectId[]

	@ApiProperty({ type: String, example: USER_EXAMPLE.friends })
	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	friends: Types.ObjectId[]

	@ApiProperty({ type: String, example: USER_EXAMPLE.friendRequests })
	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	friendRequests: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
