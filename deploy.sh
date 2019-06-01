cd frontend
npm install
npm run build
mv dist/* ../backend/site
cd ../backend
npm install
node server.js