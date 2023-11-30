import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, MONGO_COLLECTIONS } from '@app/common'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema({ versionKey: false })
export class Category extends AbstractDocument {
	@Prop({ unique: true })
	@ApiProperty({ type: String })
	title: string

	@Prop({ unique: true })
	@ApiProperty({ type: String })
	slug: string

	@ApiProperty({
		type: [String],
	})
	@Prop({ ref: MONGO_COLLECTIONS.GAMES })
	games: Types.ObjectId[]
}

export const CategorySchema = SchemaFactory.createForClass(Category)
