import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument, TypeAdminRole } from '@app/common'
import { Schema as MongooseSchema } from 'mongoose'

@Schema({ versionKey: false })
export class Admin extends AbstractDocument {
	@Prop()
	username: string

	@Prop()
	password: string

	@Prop({ type: MongooseSchema.Types.Mixed })
	role: TypeAdminRole
}

export const AdminSchema = SchemaFactory.createForClass(Admin)
