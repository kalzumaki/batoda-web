# Makefile

# Variables
DOCKER_COMPOSE = docker-compose
APP_SERVICE = app

# Docker Compose commands
up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

build:
	$(DOCKER_COMPOSE) build $(APP_SERVICE)

logs:
	$(DOCKER_COMPOSE) logs -f $(APP_SERVICE)

restart:
	$(DOCKER_COMPOSE) restart $(APP_SERVICE)

# NPM commands
npm-install:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm install

npm-run-dev:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run dev

npm-run-build:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run build

npm-run-start:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run start

# Clean up dangling images and unused volumes
clean:
	docker system prune -f
	docker volume prune -f

# Run shell inside container
shell:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) sh
