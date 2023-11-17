import {
	Body,
	Controller,
	Param,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common'
import { HighlightService } from './highlight.service'
import {
	Auth,
	CurrentUser,
	GetHighlightsPreviewsPayload,
	HIGHLIGHT_MESSAGE_PATTERNS,
	UserCurrent,
} from '@app/common'
import { CreateHighlightDto } from './dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { FileInterceptor } from '@nestjs/platform-express'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'

import { PipeTransform } from '@nestjs/common'

type TParseFormDataJsonOptions = {
	field: string
}

export class ParseFormDataJsonPipe implements PipeTransform {
	constructor(private options?: TParseFormDataJsonOptions) {}

	transform(value: any) {
		const { field } = this.options
		const jsonField = value[field].replace(
			/(\w+:)|(\w+ :)/g,
			function (matchedStr: string) {
				return (
					'"' + matchedStr.substring(0, matchedStr.length - 1) + '":'
				)
			}
		)
		return JSON.parse(jsonField)
	}
}

@Controller('highlights')
export class HighlightController {
	constructor(private readonly highlightService: HighlightService) {}

	@Post('create')
	@Auth()
	@UseInterceptors(FileInterceptor('file'))
	async create(
		@UploadedFile(new ParseFilePipe({}))
		file: Express.Multer.File,
		@Body(
			new ParseFormDataJsonPipe({ field: 'body' }),
			new ValidationPipe({ whitelist: true })
		)
		dto: CreateHighlightDto,
		@CurrentUser()
		user: UserCurrent
	) {
		await this.highlightService.createHighlight(user, dto, file.buffer)
	}

	@Post('like/:_id')
	@Auth()
	async like(@CurrentUser() user: UserCurrent, @Param('_id') _id: string) {
		await this.highlightService.likeHighlight({
			userId: user._id,
			highlightId: _id,
			isLiked: !!user.likedHighlights.find((h) => String(h) === _id),
		})
	}

	@MessagePattern(HIGHLIGHT_MESSAGE_PATTERNS.GET_PREVIEWS)
	async getPreviews(@Payload() dto: GetHighlightsPreviewsPayload) {
		return await this.highlightService.getPreviews(dto)
	}
}
