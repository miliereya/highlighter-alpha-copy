import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, MONGO_COLLECTIONS } from '@app/common'
import { Types } from 'mongoose'

@Schema({ versionKey: false })
export class Category extends AbstractDocument {
	@Prop({ unique: true })
	title: string

	@Prop({ unique: true })
	slug: string

	@Prop()
	description: string

	@Prop()
	icon: string

	@Prop({ ref: MONGO_COLLECTIONS.GAMES })
	games: Types.ObjectId[]
}

export const CategorySchema = SchemaFactory.createForClass(Category)
