import { ping } from 'tcp-ping'

describe('Health', () => {
	test('User', async () => {
		const response = await fetch('http://highlighter-server-user:5000')
		expect(response.ok).toBeTruthy()
	})

	// test('Payments', (done) => {
	// 	ping({ address: 'payments', port: 3003 }, (err) => {
	// 		if (err) {
	// 			fail()
	// 		}
	// 		done()
	// 	})
	// })

	// test('Notifications', (done) => {
	// 	ping({ address: 'notifications', port: 3004 }, (err) => {
	// 		if (err) {
	// 			fail()
	// 		}
	// 		done()
	// 	})
	// })
})
