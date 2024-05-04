#!/bin/bash

fuser -k 5173/tcp   # kills process running on port 5173 (hopefully a Vite server)

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
