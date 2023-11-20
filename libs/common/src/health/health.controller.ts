import { Controller, Get } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

@Controller('/')
export class HealthController {
	@Get()
	@ApiExcludeEndpoint()
	health() {
		return true
	}
}
