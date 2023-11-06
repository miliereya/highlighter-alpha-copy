import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { SchemaTypes, Types } from 'mongoose'

@Schema()
export class AbstractDocument {
	@ApiProperty({ type: String, example: '65470b66a87de17704c98197' })
	@Prop({ type: SchemaTypes.ObjectId })
	_id: Types.ObjectId
}
