# Sunshine-Interview-Server

### What is it?
A naïve server developed for Sunshine Interview project. It's currently divided into two parts:
1. frontend part -- designed by Miss Gu, Miss Xie and Sir Wu.
2. backend part -- designed by Sir Xu and David Xiang.

### How to deploy this server?
Well, it's now extremely easy for you to deploy. 
Please follow the below steps carefully:
1. Ask Sir Xu for our MySQL database usage and deploy the database anywhere you like.
2. Install latest [Node.js](https://nodejs.org/en/download/).
3. Type in `git clone https://github.com/David-Xiang/Sunshine-Interview-Server.git` in terminal so as to get a copy of this project in your device.
4. Open `backend/server.js` to modify server's, slave server's and database's ip addresses (into your device's ip).
5. Run `./deploy.sh` and the server shall be started to listen on port 80. Open your browser and enter `http://your-server-host/site/index.html` to check whether the server works!
