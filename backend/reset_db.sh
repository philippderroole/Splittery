#!/bin/bash

cargo sqlx database drop
cargo sqlx database create
cargo sqlx migrate run

