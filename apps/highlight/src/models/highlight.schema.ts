import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, MONGO_COLLECTIONS } from '@app/common'
import { Types } from 'mongoose'

@Schema({ versionKey: false })
export class Highlight extends AbstractDocument {
	@Prop()
	title: string

	@Prop()
	content: string[]

	@Prop({ ref: MONGO_COLLECTIONS.USERS })
	by: Types.ObjectId

	@Prop({ ref: MONGO_COLLECTIONS.GAMES })
	game: Types.ObjectId

	@Prop({ ref: MONGO_COLLECTIONS.COMMENTS, default: [] })
	comments: Types.ObjectId[]

	@Prop({ default: 0 })
	likes: number
}

export const HighlightSchema = SchemaFactory.createForClass(Highlight)
