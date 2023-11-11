import { SetMetadata } from '@nestjs/common'
import { TypeAdminRole } from '../types'

export const HasRole = (role: TypeAdminRole) => SetMetadata('role', role)
