#!/bin/bash

# fuser --kill 5173/tcp # kills process running on port 5173 (hopefully a Vite server)
lsof -i tcp:5173 | grep -v PID | awk '{print $2}' | xargs kill # To work on unix

export BACKEND_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)

# docker compose up --force-recreate --detach --build &
docker compose up &

echo "frontend at: http://${BACKEND_IP}:5173/"
echo "backend at: http://${BACKEND_IP}:4000/"
