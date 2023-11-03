import { Test, TestingModule } from '@nestjs/testing'
import { HighlightController } from '../highlight.controller'
import { HighlightService } from '../highlight.service'

describe('HighlightController', () => {
	let highlightController: HighlightController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [HighlightController],
			providers: [HighlightService],
		}).compile()

		highlightController = app.get<HighlightController>(HighlightController)
	})
})
