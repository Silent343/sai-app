#!/usr/bin/env bash
# Mock REST backend for SAI (json-server). Exposes CRUD over /api/v1/users
json-server --watch db.json --routes routes.json --port 3000
