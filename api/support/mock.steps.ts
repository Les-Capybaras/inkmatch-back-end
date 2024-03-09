import assert from 'assert'
import { When, Then } from '@cucumber/cucumber'

When('the greeter says hello', function () {
  this.whatIHeard = 'hello'
})

Then('I should have heard {string}', function (expectedResponse) {
  assert.equal(this.whatIHeard, expectedResponse)
})
