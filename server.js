"use strict";
let http = require("http");
let url = require("url");
let os = require("os");
let fs = require("fs");
let path = require("path");
let formidable = require("formidable");
let dbmodule = require("./db_connect.js");
let dbconnect = new dbmodule("10.3.97.116");

let server = http.createServer(async function(req, res) {
    console.log("Received request " + req.url);
    let pathname = url.parse(req.url).pathname;
    let query = {};
    if (url.parse(req.url).query !== null)
        query = parseQueryString(url.parse(req.url).query);

    
    let result = {};
    let result_invalid = { "type": "error", "message": "wrong pathname"};
    switch(pathname){
        case "/":
            result = {};
            break;
        case "/validate": 
            result = await getInterviewInfo(query["siteid"], query["validatecode"]);
            break;
        case "/side":
            result = await chooseSide(query["siteid"], query["side"]);
            break;
        case "/order":
            result = await chooseOrder(query["siteid"], query["order"]);
            break;
        case "/teacher":
            result = await teacherSignin(query["siteid"], query["order"], query["id"]);
            break;
        case "/querystudent":
            result = await queryStudent(query["siteid"], query["order"]);
            break;
        case "/start":
            result = await start(query["siteid"], query["order"]);
            break;
        case "/end":
            result = await end(query["siteid"], query["order"]);
            break;
        case "/queryorder":
            result = await queryOrder(query["siteid"]);
            break;
        case "/student":
            result = await studentSignin(query["siteid"], query["order"], query["id"]);
            break;
        case "/querystart":
            result = await queryStart(query["siteid"], query["order"]);
            break;
        case "/queryend":
            result = await queryEnd(query["siteid"], query["order"]);
            break;
        case "/upload":
            result = handleUpload(req, res);
            break;
        case "/download":
            handleDownload(req, res, query["filename"], "./images/");
            return;
        default:
            result = result_invalid;
    }
    if (result.type === "error")
        console.log("Error: " + result.message);
    
    res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
    res.write(JSON.stringify(result));
    res.end();
});

server.listen(80);
console.log("Server starts on port " + 80);
showLocalIP();

/** 
 * Utilities
 */
let denyPermission = {
    "type": "permission",
    "permission": "false"
};
let permission = {
    "type": "permission",
    "permission": "true"
}

function handleUpload(req){
    if (req.method.toLowerCase() !== "post")
        return result_invalid;

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
        //dbconnect.setImgURLTomDB(id, '/images/' + files.img.name);
    });
    return {"type": "upload_info", "status": "success"};
}

function handleDownload(req, res, fileName, filePath){
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
        let value = item.split("=")[1];
        query[key] = value;
    });
    return query;
}

/**
 *  /validate?siteid=0001&validatecode=0001
 */
async function getInterviewInfo(siteId, validateCode){
    // TODO: 屏蔽已开始场次
    let res = await dbconnect.getInterViewInfoFromDB(siteId, validateCode);//.catch(error => console.log(error.message));
    return JSON.parse(res);
}

/**
 * /side?siteid=0001&side=teacher
 */
async function chooseSide(siteId, side){
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
    let str = await dbconnect.studentQueryOrderFromDB(siteId);
    let res = JSON.parse(str);
    return res;
}

/**
 * /student?siteid=0001&order=01&id=11990001
 */
async function studentSignin(siteId, order, id){
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
    let str = await dbconnect.checkEndFromDB(siteId, order);
    let res = JSON.parse(str);

    if (res.result === "true"){
        return permission;
    }
    return denyPermission;
}