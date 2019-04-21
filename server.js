"use strict";
let dbhost = "10.2.147.123";
let http = require("http");
let url = require("url");
let os = require("os");
let fs = require("fs");
let path = require("path");
let formidable = require("formidable");
let dbmodule = require("./db_connect.js");
let dbconnect = new dbmodule(dbhost);
let mime = require("./mime").types;

/** 
 * Utilities
 */
let denyPermission = {
    "type": "permission",
    "permission": "false",
    "error": "validation"
};
let permission = {
    "type": "permission",
    "permission": "true",
    "error": null
}
let illegalRequest = {
    "type": "permission",
    "permission": "false", 
    "error": "request"
}

let server = http.createServer(async function(req, res) {
    console.log(new Date().toLocaleString() + ": Received request " + req.url);

    let pathname = url.parse(req.url).pathname;
    let query = {};
    let pathinfo = {};
    if (url.parse(req.url).query !== null){
        query = parseQueryString(url.parse(req.url).query);
    }
    pathinfo = parsePathString(url.parse(req.url).pathname);
    console.log(pathinfo);
    
    let result = {};
    switch(pathinfo.type){
        case "/":
            result = illegalRequest;
            responseJson(result);
            break;
        case "/validate": 
            result = await getInterviewInfo(query["siteid"], query["validatecode"]);
            responseJson(result);
            break;
        case "/side":
            result = await chooseSide(query["siteid"], query["side"]);
            responseJson(result);
            break;
        case "/order":
            result = await chooseOrder(query["siteid"], query["order"]);
            responseJson(result);
            break;
        case "/teacher":
            result = await teacherSignin(query["siteid"], query["order"], query["id"]);
            responseJson(result);
            break;
        case "/querystudent":
            result = await queryStudent(query["siteid"], query["order"]);
            responseJson(result);
            break;
        case "/start":
            result = await start(query["siteid"], query["order"]);
            responseJson(result);
            break;
        case "/end":
            result = await end(query["siteid"], query["order"]);
            responseJson(result);
            break;
        case "/queryorder":
            result = await queryOrder(query["siteid"]);
            responseJson(result);
            break;
        case "/student":
            result = await studentSignin(query["siteid"], query["order"], query["id"]);
            responseJson(result);
            break;
        case "/querystart":
            result = await queryStart(query["siteid"], query["order"]);
            responseJson(result);
            break;
        case "/queryend":
            result = await queryEnd(query["siteid"], query["order"]);
            responseJson(result);
            break;
        case "/upload":
            result = handleUpload(req, res, pathinfo.path);
            responseJson(result);
            break;
        case "/download":
            await handleDownload(req, res, query["filename"], "./images/");
            // TODO
            break;
        case "/reset":
            // Backdoor: reset database
            // DELETE BEFORE RELEASE!!!
            await dbconnect.cleanData();
            responseJson(result);
            break;
        case "/static":
            handleSite(req, res, "./site/static" + pathinfo.path);
            break;
        case "/site":
            handleSite(req, res, "./site" + pathinfo.path);
            // TODO
            break;
        case "/reqLogIn":
            responseJson(res, permission);
            break;
        default:
            result = illegalRequest;
            responseJson(res, result);
            break;
    }
});

server.listen(80);
console.log("Server starts on port " + 80);
showLocalIP();

function responseJson(res, json){
    responseText(res, JSON.stringify(json));
}

function responseText(res, textString){
    res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
    res.write(textString);
    res.end();
}

function responseError(res, text){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write(text);
    res.end();
}

function handleUpload(req, res, id){
    if (!id)
        return illegalRequest;
    if (req.method.toLowerCase() !== "post")
        return illegalRequest;

    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "./origin";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        // rename file
        let oldpath= files.img.path;
        let newpath = __dirname+'/images/' + files.img.name;
        
        console.log("Saving image at " + newpath);

        fs.rename(oldpath, newpath, function(err){
            if(err){ throw Error("Error in renaming!"); }
        }); 
        dbconnect.setImgURLToDB(id, '/images/' + files.img.name);
    });
    return {"type": "upload_info", "status": "success"};
}

function handleSite(req, res, realpath){
    fs.exists(realpath, function(exist){
        if (!exist){
            responseError(res, "This request URL " + realpath + " was not found on this server.");
            return;
        }
        fs.readFile(realpath, "binary", function(err, file){
            if (err){
                responseError(res, JSON.stringify(err));
                return;
            }
    
            let ext = path.extname(realpath);
            ext = ext ? ext.slice(1) : 'unknown';
            let contentType = mime[ext] || "text/plain";
            res.writeHead(200, {'Content-Type': contentType});
            res.write(file, "binary");
            res.end();
        });
    });
}

async function handleDownload(req, res, fileName, filePath){
    if (!fileName)
        return illegalRequest;
    if (!await fs.existsSync(filePath+fileName))
        return illegalRequest;
    res.writeHead(200,{  
        'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件  
        'Content-Disposition': 'attachment; filename=' + fileName, //告诉浏览器这是一个需要下载的文件  
    });
    fs.createReadStream(filePath+fileName).pipe(res);
}

function showLocalIP(){
    let ipv4 , hostname;
    hostname=os.hostname();
    for(let i = 0;i < os.networkInterfaces().en0.length;i++){
        if(os.networkInterfaces().en0[i].family=='IPv4'){
            ipv4=os.networkInterfaces().en0[i].address;
        }
    }
    console.log('Local IP: ' + ipv4);
    console.log('Local host: '+ hostname);
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
    console.log("pathString: " + pathString);
    let info = {};
    let pathIndex = pathString.indexOf("/", 1);
    if (pathIndex === -1)
        pathIndex = pathString.length;
    info.type = pathString.substring(0, pathIndex);
    info.path = pathString.substring(pathIndex);
    return info;
}

/**
 *  /validate?siteid=0001&validatecode=0001
 */
async function getInterviewInfo(siteId, validateCode){
    // TODO: 屏蔽已开始场次
    if(!siteId || !validateCode)
        return illegalRequest;

    let resStr = await dbconnect.getInterViewInfoFromDB(siteId, validateCode);
    let res = JSON.parse(resStr);
     
    return res;
}

/**
 * /side?siteid=0001&side=teacher
 */
async function chooseSide(siteId, side){
    if (!siteId || !side)
        return illegalRequest;

    let str = await dbconnect.checkSideFromDB(siteId, side);
    let res = JSON.parse(str);
    
    // false means side is available
    if (res.result == 'false'){
        await dbconnect.chooseSideToDB(siteId, side);
        return permission;
    }
    return denyPermission;
}

/**
 * /order?siteid=0001&order=01 
 */
async function chooseOrder(siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let str = await dbconnect.checkOrderFromDB(siteId, order);
    let res = JSON.parse(str);

    if (res.result  === "false"){
        await dbconnect.chooseOrderToDB(siteId, order);
        return permission;
    }
    return denyPermission;
}

/**
 * /teacher?siteid=0001&order=01&id=11990001
 */
async function teacherSignin(siteId, order, id){
    if (!siteId || !order || !id)
        return illegalRequest;

    // simply discard order information
    // TODO: 考官重复签到，interview info增加signin_before
    let str = await dbconnect.checkTeacherSigninFromDB(siteId, order, id);
    let res = JSON.parse(str);

    if (res.result  === "true"){
        await dbconnect.teacherSigninToDB(siteId, order, id);
        return permission;
    }
    return denyPermission;
}

/**
 * /querystudent?siteid=0001&order=01
 */
async function queryStudent(siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let result = {"type": "signin_info"};
    
    let str = await dbconnect.queryStudentFromDB(siteId, order);
    let res = JSON.parse(str);

    result.info = res.info;
    return result;
}

/**
 * /start?siteid=0001&order=01
 */
async function start(siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    // simply discard order information
    let str = await dbconnect.startInterviewToDB(siteId, order);
    let res = JSON.parse(str);
    if (res.oldStartTimeRecord === "null"){
        return permission;
    }
    return denyPermission;   
}

/**
 * /end?siteid=0001&order=01
 */
async function end(siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    await dbconnect.endInterviewToDB(siteId, order);
    return permission;
}

/**
 * /queryorder?siteid=0001
 */
async function queryOrder(siteId){
    // IMPORTANT:
    // current pair relation must be (TEACHER WAIT FOR STUDENT) 
    // if so, return true
    if (!siteId)
        return illegalRequest;

    let str = await dbconnect.studentQueryOrderFromDB(siteId);
    let res = JSON.parse(str);
    return res;
}

/**
 * /student?siteid=0001&order=01&id=11990001
 */
async function studentSignin(siteId, order, id){
    if (!siteId || !order || !id)
        return illegalRequest;

    let str = await dbconnect.checkStudentSigninFromDB(siteId, order, id);
    let res = JSON.parse(str);
    if (res.result  === "true"){
        await dbconnect.studentSigninToDB(siteId, order, id);
        return permission;
    }
    return denyPermission;
}

/**
 * /querystart?siteid=0001&order=01
 */
async function queryStart(siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let str = await dbconnect.checkStartFromDB(siteId, order);
    let res = JSON.parse(str);

    if (res.result === "true"){
        return permission;
    }
    return denyPermission;
}

/**
 * /queryend?siteid=0001&order=01
 */
async function queryEnd(siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let str = await dbconnect.checkEndFromDB(siteId, order);
    let res = JSON.parse(str);

    if (res.result === "true"){
        return permission;
    }
    return denyPermission;
}