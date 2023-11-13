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
import { catchError, map, Observable, of, tap } from 'rxjs'
import { USER_MESSAGE_PATTERNS, USER_SERVICE } from '../constants'
import { ApiJwt } from '@app/api'

@Injectable()
class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name)

	constructor(
		@Inject(USER_SERVICE) private readonly authClient: ClientProxy
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
			.send(USER_MESSAGE_PATTERNS.AUTHENTICATE, {
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

export const Auth = () => applyDecorators(UseGuards(JwtAuthGuard), ApiJwt())
