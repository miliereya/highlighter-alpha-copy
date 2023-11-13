import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, MONGO_COLLECTIONS } from '@app/common'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HIGHLIGHT_EXAMPLE } from '../swagger/api-examples'

@Schema({ versionKey: false })
export class Highlight extends AbstractDocument {
	@ApiProperty({ type: String, example: HIGHLIGHT_EXAMPLE.title })
	@Prop()
	title: string

	@ApiProperty({ type: [String], example: HIGHLIGHT_EXAMPLE.content })
	@Prop()
	content: string[]

	@ApiProperty({ type: String, example: HIGHLIGHT_EXAMPLE.by })
	@Prop({ ref: MONGO_COLLECTIONS.USERS })
	by: Types.ObjectId

	@ApiProperty({ type: String, example: HIGHLIGHT_EXAMPLE.game })
	@Prop({ ref: MONGO_COLLECTIONS.GAMES })
	game: Types.ObjectId

	@ApiProperty({ type: [String], example: HIGHLIGHT_EXAMPLE.comments })
	@Prop({ ref: MONGO_COLLECTIONS.COMMENTS, default: [] })
	comments: Types.ObjectId[]

	@ApiProperty({ type: Number, example: HIGHLIGHT_EXAMPLE.likes })
	@Prop({ default: 0 })
	likes: number
}

export const HighlightSchema = SchemaFactory.createForClass(Highlight)
