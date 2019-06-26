if [[ $1 = "master" ]]
then
    echo "Compiling website..."
    cd frontend
    npm install chromedriver --registry=https://registry.npm.taobao.org
    npm install
    npm run build
    rm -rf ../backend/site/*
    mv dist/* ../backend/site
    cd ..
fi

echo "Deploying server"
cd backend
npm install -g pm2 --registry=https://registry.npm.taobao.org
npm install
rm -rf files/images/*
rm -rf files/videos/*

if [[ $1 = "slave" ]]
then
    echo "Starting slave server"
    pm2 start slave_server.js
elif [[ $1 = "master" ]]
then 
    echo "Starting master server"
    pm2 start master_server.js
fi