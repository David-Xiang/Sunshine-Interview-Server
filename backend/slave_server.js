"use strict";
let http = require("http");
let url = require("url");
let path = require("path");
let fs = require("fs");
let port = 80;

let permission = {
    type: "permission",
    permission: "true"
};

function responseText(res, textString){
    res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
    res.write(textString);
    res.end();
}

function responseJson(res, json){
    responseText(res, JSON.stringify(json));
}

function parseQueryString(queryString){
    let query = {};
    queryString.split("&").forEach(item=>{
        let key = item.split("=")[0];
        let value = decodeURI(item.split("=")[1]);
        query[key] = value;
    });
    return query;
}

function parsePathString(pathString){
    let info = {};
    let pathIndex = pathString.indexOf("/", 1);
    if (pathIndex === -1)
        pathIndex = pathString.length;
    info.type = pathString.substring(0, pathIndex);
    info.path = pathString.substring(pathIndex);
    return info;
}

function handleUpload(req, res, realpath){
    if (req.method.toLowerCase() !== "post")
        responseJson(res, illegalRequest);
    console.log("[handleUpload] realpath = " + realpath);
    realpath = "./files" + realpath;
    let targetDir = path.dirname(realpath);
    if (!fs.existsSync(targetDir)) {  
        console.log("[handleUpload] creating new dir " + targetDir);
        fs.mkdirSync(targetDir);  
    }
    let downUrl = ""; 
    req.on("data", function(chunk){
        downUrl += chunk;
    });
    req.on("end", function(){
        console.log("downUrl:" + downUrl);
        responseJson(res, permission);
        let file = fs.createWriteStream(realpath);
        let request = http.get(downUrl, function(response) {
            response.pipe(file);
        });
    });
}

function handleInfo(req, res, id){
    if (req.method.toLowerCase() === "post"){
        let data = "";
        req.on("data", function(chunk){
            data += chunk;
        });
        req.on("end", function(){
            console.log("[handleInfo] upload info: ");
            console.log(data);
            responseText(res, "Slave: upload info successfully");
            let dir = `./files/videos/${id}`;
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
            fs.writeFileSync(`${dir}/info.json`, data);
        });
        return;
    }

    if (req.method.toLowerCase() === "get"){
        let realpath = `./files/videos/${id}/info.json`;
        if (!fs.existsSync(realpath)){
            responseText(res, "Slave: no such info.json");
            return;
        }
        let data = fs.readFileSync(realpath);
        res.write(data);
        res.end();
    }
}

async function handleDownload(res, realpath){
    let filePath = "./files" + realpath;
    console.log(`download path: ${filePath}`);
    if (!await fs.existsSync(filePath)){
        responseText(res, "Download request " + realpath 
        + " was not found on this server.");
        return;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200,{  
        'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
        'Content-Disposition': 'attachment; filename=' 
        + path.basename(filePath) //告诉浏览器这是一个需要下载的文件
    });
    fs.createReadStream(filePath).pipe(res);
}

let server = http.createServer(function(req, res){
    console.log(new Date().toLocaleString() + ": Received request " + req.url);
    
    let query = {};
    let pathinfo = {};
    if (url.parse(req.url).query !== null){
        query = parseQueryString(url.parse(req.url).query);
    }
    pathinfo = parsePathString(url.parse(req.url).pathname);

    switch(pathinfo.type){
        case "/": 
            responseJson(res, permission);
            break;
        case "/upload":
            handleUpload(req, res, pathinfo.path);
            break;
        case "/videoinfo":
            handleInfo(req, res, query["id"]);
            break;
        case "/download":
            handleDownload(res, pathinfo.path);
            break;
    }
});

server.listen(port);
console.log("Slave starts on port " + port);