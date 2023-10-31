.PHONY: database frontend backend

dev: frontend backend

database:
	docker kill postgres > /dev/null 2>&1
	sleep 1
	docker run --rm --name postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=postgres -e POSTGRES_DB=share_expenses -p 5432:5432 postgres

frontend:
	cd frontend && npm run dev

backend: database
	cd backend && cargo run

