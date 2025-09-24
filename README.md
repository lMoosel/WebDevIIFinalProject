Here is the link to our hosted website through AWS: http://3.139.99.89:5173 (Not currently hosted)

To run locally do the following commmands.

cd server
npm i
npm run seed 
npm start

cd my-react-app
npm i
npm run dev

To run locally using docker use the following commands:

docker compose up --build               This rebuilds the docker images and starts up the docker containers

To seed the database when running with docker run:
docker ps                               This is used to get the container id of each container we are focused on the webdeviifinalproject-backend container
docker exec -it <container-id> sh       This opens up the docker shell for the specified container allowing us to run commands
npm run seed                            This will run inside the docker container seeding the database

When creating an account you can use the following spotify information to authorize with spotify. 
qel13832@vogco.com
Pattyhill123$

If you want to log in to an existing account with some friends and friend requests you can log in with the following info. 
jakell.trayon@milkgitter.com
Pattyhill123$

If you'd like to log in using your own Spotify account, please send a message to one of us on Slack/Email. We'll need to add the email linked to your Spotify account to our Spotify application. To use the Spotify API, we must register a project with them, and during the free development mode, we can manually authorize up to 25 emails. 
