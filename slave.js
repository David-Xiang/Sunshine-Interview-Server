"use strict";
let http = require("http");
let url = require("url");
let path = require("path");
let fs = require("fs");
let port = 15213;

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
    // console.log("[handleUpload] realpath = " + realpath);
    realpath = "./files" + realpath;
    let targetDir = path.dirname(realpath);
    if (!fs.existsSync(targetDir)) {  
        // console.log("[handleUpload] creating new dir " + targetDir);
        fs.mkdirSync(targetDir);  
    }
    let downUrl = ""; 
    req.on("data", function(chunk){
        downUrl += chunk;
    });
    req.on("end", function(){
        // console.log("downUrl:" + downUrl);
        responseJson(res, permission);
        let file = fs.createWriteStream(realpath);
        let request = http.get(downUrl, function(response) {
            response.pipe(file);
        });
    });
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
    }
});

server.listen(port);
console.log("Slave starts on port" + port);