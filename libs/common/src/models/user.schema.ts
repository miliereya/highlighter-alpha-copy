import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, MONGO_COLLECTIONS } from '@app/common'
import { Types } from 'mongoose'

@Schema({ versionKey: false })
export class User extends AbstractDocument {
	@Prop({ unique: true })
	email: string

	@Prop({ unique: true, minlength: 3, maxlength: 24 })
	username: string

	@Prop()
	password: string

	@Prop({ default: '' })
	avatar: string

	@Prop({ default: [] })
	highlights: []

	@Prop({ ref: MONGO_COLLECTIONS.HIGHLIGHTS, default: [] })
	likedHighlights: Types.ObjectId[]

	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	subscribers: Types.ObjectId[]

	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	subscribed: Types.ObjectId[]

	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	friends: Types.ObjectId[]

	@Prop({ ref: MONGO_COLLECTIONS.USERS, default: [] })
	friendRequests: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
