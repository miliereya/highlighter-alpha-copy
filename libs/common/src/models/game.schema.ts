import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, MONGO_COLLECTIONS } from '@app/common'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { GAME_EXAMPLE } from '@app/api'

@Schema({ versionKey: false })
export class Game extends AbstractDocument {
	@ApiProperty({ type: String, example: GAME_EXAMPLE.title })
	@Prop({ unique: true })
	title: string

	@ApiProperty({ type: String, example: GAME_EXAMPLE.slug })
	@Prop({ unique: true })
	slug: string

	@ApiProperty({ type: String, example: GAME_EXAMPLE.description })
	@Prop()
	description: string

	@ApiProperty({ type: String, example: GAME_EXAMPLE.icon })
	@Prop()
	icon: string

	@ApiProperty({ type: String, example: GAME_EXAMPLE.categories })
	@Prop({ ref: MONGO_COLLECTIONS.CATEGORIES })
	categories: Types.ObjectId[]
}

export const GameSchema = SchemaFactory.createForClass(Game)
