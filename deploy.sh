cd frontend
npm install
npm run build
rm -rf ../backend/site/*
rm -rf ../backend/files/images/*
rm -rf ../backend/files/videos/*
mv dist/* ../backend/site
cd ../backend
npm install
node server.js
