#/bin/bash

# This script is used to reset the database to a clean state.

docker compose rm

docker volume rm -f backend_db-data