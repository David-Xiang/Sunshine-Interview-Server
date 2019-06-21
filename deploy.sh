cd frontend
npm install
npm run build
rm -rf ../backend/site/*
mv dist/* ../backend/site
cd ../backend
npm install
node server.js
