#!/bin/bash
docker kill postgres > /dev/null 2>&1

sleep 1

docker run --rm --name postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=postgres -e POSTGRES_DB=splittery -p 5432:5432 postgres