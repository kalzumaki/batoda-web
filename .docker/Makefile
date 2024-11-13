DOCKER_COMPOSE = docker-compose
APP_SERVICE = app

# Docker Compose Commands

setup:
	@$(MAKE) build
	@$(MAKE) up

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

# NPM Commands within Docker Container
npm-install:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm install

npm-run-dev:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run dev

npm-run-build:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run build

npm-run-start:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npm run start

# Cleanup Commands
clean:
	docker system prune -f
	docker volume prune -f

# Open Shell in App Service
shell:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) sh
