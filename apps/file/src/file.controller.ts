import {
	Controller,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileService } from './file.service'
import { FileInterceptor } from '@nestjs/platform-express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					// new MaxFileSizeValidator({ maxSize: 1000 }),
					// new FileTypeValidator({ fileType: 'image/jpeg' }),
				],
			})
		)
		file: Express.Multer.File
	) {
		return await this.fileService.upload(file.originalname, file.buffer)
	}
}
