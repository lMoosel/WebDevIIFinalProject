cd server
npm i
start-process powershell.exe -ArgumentList "-Command docker compose up"


cd ../my-react-app
npm i 
start-process powershell.exe -ArgumentList "-Command npm run dev"

cd ..
echo "frontend at: http://localhost:5173/"
echo "backend at: http://localhost:4000/"