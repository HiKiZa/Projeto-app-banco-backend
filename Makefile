up-build:
	docker compose up -d --build

up:
	docker compose up -d

down:
	docker compose down -v
	
logs:
	docker compose logs -f web