.PHONY: test

# Run tests inside container
tests:
	@make unit-test
	@make functional-test
	@make coverage-test

unit-test:
	docker exec inkmatch-back-end-api-1 npm run test

functional-test:
	docker exec inkmatch-back-end-api-1 npm run functional:test

coverage-test:
	docker exec inkmatch-back-end-api-1 npm run test:coverage
