import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Admin } from '../models/admin.schema'

const getCurrentAdminByContext = (context: ExecutionContext): Admin => {
	return context.switchToHttp().getRequest().user
}

export const CurrentAdmin = createParamDecorator(
	(_data: unknown, context: ExecutionContext) =>
		getCurrentAdminByContext(context)
)
