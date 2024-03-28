import { test } from '@japa/runner'

test.group('Mock functional tests', () => {
  test('example test', async ({ assert }) => {
    assert.equal(1, 1)
  })
})
