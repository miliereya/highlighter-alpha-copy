import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UseGuards,
	applyDecorators,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Reflector } from '@nestjs/core'
import { catchError, map, Observable, of, tap } from 'rxjs'
import { USER_SERVICE } from '../constants'

@Injectable()
class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name)

	constructor(
		@Inject(USER_SERVICE) private readonly authClient: ClientProxy,
		private readonly reflector: Reflector
	) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const jwt =
			context.switchToHttp().getRequest().cookies?.Authentication ||
			context.switchToHttp().getRequest().headers?.authentication
		if (!jwt) {
			return false
		}
		return this.authClient
			.send('authenticate', {
				Authentication: jwt,
			})
			.pipe(
				tap((res) => {
					context.switchToHttp().getRequest().user = res
				}),
				map(() => true),
				catchError((err) => {
					this.logger.error(err)
					return of(false)
				})
			)
	}
}

export const Auth = () => applyDecorators(UseGuards(JwtAuthGuard))
