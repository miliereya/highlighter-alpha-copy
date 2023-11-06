import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
	AbstractDocument,
	CATEGORY_EXAMPLE,
	MONGO_COLLECTIONS,
} from '@app/common'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema({ versionKey: false })
export class Category extends AbstractDocument {
	@ApiProperty({ type: String, example: CATEGORY_EXAMPLE.title })
	@Prop({ unique: true })
	title: string

	@ApiProperty({ type: String, example: CATEGORY_EXAMPLE.slug })
	@Prop({ unique: true })
	slug: string

	@ApiProperty({
		type: String,
		example: CATEGORY_EXAMPLE.description,
	})
	@Prop()
	description: string

	@ApiProperty({
		type: String,
		example: CATEGORY_EXAMPLE.icon,
	})
	@Prop()
	icon: string

	@ApiProperty({
		type: [String],
		example: CATEGORY_EXAMPLE.games,
	})
	@Prop({ ref: MONGO_COLLECTIONS.GAMES })
	games: Types.ObjectId[]
}

export const CategorySchema = SchemaFactory.createForClass(Category)
