.PHONY: build up down logs restart clean dev prod test

# Development commands
dev:
	docker compose -f docker-compose.dev.yml up -d

dev-build:
	docker compose -f docker-compose.dev.yml up --build -d

dev-down:
	docker compose -f docker-compose.dev.yml down

# Production commands
prod:
	docker compose up --build -d

prod-build:
	docker compose up --build

prod-down:
	docker compose down

# General commands
logs:
	docker compose logs -f

restart:
	docker compose restart

clean-dev:
	docker compose -f docker-compose.dev.yml down -v
	docker system prune -f

clean:
	docker compose down -v
	docker system prune -f

# Testing
test:
	docker compose exec server npm test

# Database
db-shell:
	docker compose exec db mongosh

# Help
help:
	@echo "Available commands:"
	@echo "  dev          - Start development environment"
	@echo "  dev-build    - Build and start development environment"
	@echo "  dev-down     - Stop development environment"
	@echo "  prod         - Start production environment"
	@echo "  prod-build   - Build and start production environment"
	@echo "  prod-down    - Stop production environment"
	@echo "  logs         - View container logs"
	@echo "  restart      - Restart containers"
	@echo "  clean        - Remove containers, volumes, and prune system"
	@echo "  test         - Run tests"
	@echo "  db-shell     - Access MongoDB shell"