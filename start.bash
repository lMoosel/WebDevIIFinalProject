#!/bin/bash

cd server
npm i
npm start &

cd ../my-react-app
npm i
npm run dev
