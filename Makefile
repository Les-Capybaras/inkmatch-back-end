.PHONY: start tests

start:
	docker compose up -d
	docker exec -it adonis node ace migration:fresh
	docker exec -it adonis node ace db:seed

tests:
	docker exec -it adonis npm run test

unit-watch:
	docker exec -it adonis npm run test:watch