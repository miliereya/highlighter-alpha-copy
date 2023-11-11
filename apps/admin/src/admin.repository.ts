import { Injectable, Logger } from '@nestjs/common'
import { AbstractRepository, Admin } from '@app/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class AdminRepository extends AbstractRepository<Admin> {
	protected readonly logger = new Logger(AdminRepository.name) as any

	constructor(
		@InjectModel(Admin.name)
		adminModel: Model<Admin>
	) {
		super(adminModel)
	}
}
