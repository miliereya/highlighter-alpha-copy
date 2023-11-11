import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
	UseGuards,
	applyDecorators,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Reflector } from '@nestjs/core'
import { catchError, map, Observable, of, tap } from 'rxjs'
import { ADMIN_MESSAGE_PATTERNS, ADMIN_SERVICE } from '../constants'
import { AdminData, TypeAdminRole } from '../types'
import { HasRole } from '../decorators'
import { ApiAdminJwt } from '..'
import { ApiTags } from '@nestjs/swagger'

@Injectable()
class AdminAuthGuard implements CanActivate {
	private readonly logger = new Logger(AdminAuthGuard.name)

	constructor(
		@Inject(ADMIN_SERVICE) private readonly adminClient: ClientProxy,
		private readonly reflector: Reflector
	) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const jwt =
			context.switchToHttp().getRequest().cookies?.Admin ||
			context.switchToHttp().getRequest().headers?.admin
		if (!jwt) {
			return false
		}

		const role = this.reflector.getAllAndOverride<TypeAdminRole>('role', [
			context.getHandler(),
			context.getClass(),
		])

		return this.adminClient
			.send<AdminData>(ADMIN_MESSAGE_PATTERNS.AUTHENTICATE, {
				Admin: jwt,
			})
			.pipe(
				tap((admin) => {
					if (
						!role ||
						admin.role === 'owner' ||
						(role === 'creator' && admin.role === 'creator') ||
						(role === 'moderator' && admin.role === 'moderator')
					) {
						context.switchToHttp().getRequest().admin = admin
					} else {
						throw new UnauthorizedException()
					}
				}),
				map(() => true),
				catchError((err) => {
					this.logger.error(err)
					return of(false)
				})
			)
	}
}

export const AdminGuard = () =>
	applyDecorators(UseGuards(AdminAuthGuard), ApiTags('Admin'), ApiAdminJwt())
export const ModeratorGuard = () =>
	applyDecorators(
		HasRole('moderator'),
		UseGuards(AdminAuthGuard),
		ApiTags('Admin: Moderator'),
		ApiAdminJwt()
	)
export const CreatorGuard = () =>
	applyDecorators(
		HasRole('creator'),
		UseGuards(AdminAuthGuard),
		ApiTags('Admin: Creator'),
		ApiAdminJwt()
	)

export const OwnerGuard = () =>
	applyDecorators(
		HasRole('owner'),
		UseGuards(AdminAuthGuard),
		ApiTags('Admin: Owner'),
		ApiAdminJwt()
	)
