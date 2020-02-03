#!/bin/bash

DB="local-test"
psql postgres://postgres@localhost:5432/postgres -c "drop database if exists \"${DB}\""
