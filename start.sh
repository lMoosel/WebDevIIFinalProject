#!/bin/bash

# fuser --kill 5173/tcp # kills process running on port 5173 (hopefully a Vite server)
lsof -i tcp:5173 | grep -v PID | awk '{print $2}' | xargs kill # To work on unix

cd server
npm i

# docker compose up --force-recreate --detach --build &
docker compose up &

cd ../my-react-app
npm i
npm run dev &

cd ..
echo "frontend at: http://localhost:5173/"
echo "backend at: http://localhost:4000/"
