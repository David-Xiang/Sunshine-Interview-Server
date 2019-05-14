"use strict";
let dbhost = "192.168.43.89";
let http = require("http");
let url = require("url");
let os = require("os");
let fs = require("fs");
let path = require("path");
let formidable = require("formidable");
let encryptor = require('encryptjs');
let mime = require("./mime").types;
let dbmodule = require("./db_connect");
let dbconnect = new dbmodule(dbhost);
let chain = require("./chain")();
let ip;


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
    "legal": "false",
    "result": "false",
    "error": "request"
}

function Log(tag, msg){
    console.log()
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
    
    let result = {};
    switch(pathinfo.type){
        case "/":
            result = illegalRequest;
            responseJson(res, result);
            break;
        case "/validate": 
            result = await getInterviewInfo(query["siteid"].substring(0, query["siteid"].length-2), query["siteid"], query["validatecode"]);
            responseJson(res, result);
            break;
        case "/side":
            result = await chooseSide(query["collegeid"], query["siteid"], query["side"]);
            responseJson(res, result);
            break;
        case "/order":
            result = await chooseOrder(query["collegeid"], query["siteid"], query["order"]);
            responseJson(res, result);
            break;
        case "/teacher":
            result = await teacherSignin(query["collegeid"], query["siteid"], query["order"], query["id"]);
            responseJson(res, result);
            break;
        case "/querystudent":
            result = await queryStudent(query["collegeid"], query["siteid"], query["order"]);
            responseJson(res, result);
            break;
        case "/start":
            result = await start(query["collegeid"], query["siteid"], query["order"]);
            responseJson(res, result);
            break;
        case "/end":
            result = await end(query["collegeid"], query["siteid"], query["order"]);
            responseJson(res, result);
            break;
        case "/queryorder":
            result = await queryOrder(query["collegeid"], query["siteid"]);
            responseJson(res, result);
            break;
        case "/student":
            result = await studentSignin(query["collegeid"], query["siteid"], query["order"], query["id"]);
            responseJson(res, result);
            break;
        case "/querystart":
            result = await queryStart(query["collegeid"], query["siteid"], query["order"]);
            responseJson(res, result);
            break;
        case "/queryend":
            result = await queryEnd(query["collegeid"], query["siteid"], query["order"]);
            responseJson(res, result);
            break;
        case "/upload":
            // path like "/videos/6000060/1.mp4"
            handleUpload(req, res, pathinfo.path, query["id"], query["collegeid"]);
            break;
        case "/download":
            await handleDownload(res, pathinfo.path);
            break;
        case "/reset":
            // Backdoor: reset database
            // DELETE BEFORE RELEASE!!!
            result = JSON.parse(await dbconnect.cleanDataToDB(query["collegeid"]));
            responseJson(res, result);
            break;
        case "/static":
            handleSite(res, "./site/static" + pathinfo.path);
            break;
        case "/site":
            handleSite(res, "./site" + pathinfo.path);
            break;
        case "/login":
            handleLogin(req, res);
            break;
        case "/register":
            // TOKEN
            handleRegister(req, res);
            break;
        case "/sitetable":
            handleSiteTable(req, res, query["collegeid"]);
            break;
        case "/search":
            handleSearch(req, res);
            break;
        case "/addhash":
            handleAddHash(req, res);
            break;
        case "/verifyhash":
            handleVerifyHash(req, res, query["interviewid"]);
            break;
        default:
            result = illegalRequest;
            responseJson(res, result);
            break;
    }
});

server.listen(80);
console.log("Server starts on port " + 80);
ip = showLocalIP();

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

function handleAddHash(req, res, interviewId, index, hash){
    responseJson(res, permission);
    let videoId = interviewId;
    for (let i = 0; i < 4-String(index).length; i++)
        videoId = videoId + '0';
    videoId += reqJson.index;
    let arg = {
        videoID: videoId,
        hash: hash
    }
    chain.addHashToChain(arg, function(data){
        responseJson(res, data);
    });
}

function handleVerifyHash(req, res, interviewId){
    let arg = {
        videoID: interviewId,
        hashs: []
    };

    let videosInfoPath = "./files/videos/" + interviewId + "/info.json";
    if (!fs.existsSync(videosInfoPath)){
        responseError(res, "There's no videos recorded under this interview.");
        return;
    }

    let videoInfo = JSON.parse(fs.readFileSync(videosInfoPath));
    console.log("VIDEO INFO");
    console.log(videoInfo);
    let arr = videoInfo.urls;
    for (let i = 0; i < arr.length; i++){
        let path = "./files" + arr[i];
        console.log(path);
        arg.hashs.push(dbconnect.computeHash(path));
    }
    console.log("BEFORE verifyHashsFromChain");
    console.log(arg);
    chain.verifyHashsFromChain(arg, function(data){
        responseJson(res, data);
    });
}

async function handleSearch(req, res){
    let dataStr = "";
    req.on('data', function (chunk) {
        dataStr += chunk;
    });
    req.on('end', async function(){
        dataStr = decodeURI(dataStr);
        let reqJson = JSON.parse(dataStr);
        let data = await dbconnect.webValidateCertificationFromDB(reqJson.studentID);
        data = JSON.parse(data);
        if (data.legal == "false"){
            responseJson(illegalRequest);
            return;
        }
        //let data = {interviewID: 660001};
        let videoInfo = JSON.parse(fs.readFileSync("./files/videos/" + data.interviewID + "/info.json"));
        console.log("VIDEO INFO");
        console.log(videoInfo);
        let arr = videoInfo.urls;
        for (let i = 0; i < arr.length; i++){
            arr[i] = "http://" + ip + "/download" + arr[i];
        }
        data.videos = videoInfo;
        res.write(JSON.stringify(data));
        res.end();
    });
}



async function handleSiteTable(req, res, CollegeID){
    let data = await dbconnect.webGetSiteTableFromDB(CollegeID);
    responseText(res, data);
}

function handleLogin(req, res){
    let dataStr = "";
    req.on('data', function (chunk) {
        dataStr += chunk;
    });
    req.on('end', async function(){
        dataStr = decodeURI(dataStr);
        let reqJson = JSON.parse(dataStr);
        console.log(reqJson);
        if (typeof(reqJson.username) !== "string" || typeof(reqJson.password) !== "string"){
            responseJson(res, illegalRequest);
            return;
        }
        //let secretKey = "SunshineInterview";
        //reqJson.password = encryptor.decrypt(reqJson.password, secretKey, 256);
        // console.log("deciphered key");
        // console.log(reqJson.password);
        let info = null;
        switch (reqJson.loginState){
            case "student":
                info = await dbconnect.webValidateCertificationFromDB(reqJson.password, reqJson.username);
                responseText(res, info);
                break; 
            case "teacher":
                info = await dbconnect.webValidateInformationFromDB(reqJson.username, reqJson.password);
                responseText(res, info);
                break; 
            case "school":
                info = await dbconnect.webValidateVideoFromDB(reqJson.username, reqJson.password);
                responseText(res, info);
                break;
            default: 
                responseJson(res, illegalRequest);
                return;
        }
    });
}

async function handleRegister(req, res){
    if (req.method.toLowerCase() !== "post"){
        console.log("not post");
        console.log(req.method);
        return denyPermission;
    }
    let dataStr = "";
    req.on('data', function (chunk) {
        dataStr += chunk;
    });
    req.on('end', async function(){
        let foundCollegeID = false;
        dataStr = decodeURI(dataStr);
        responseJson(res, permission);
        let data = JSON.parse(dataStr);
        let collegeID = null;
        if (data.hasOwnProperty("teacher")){
            let arr = data.teacher;
            for (let i = 0; i < arr.length; i++){
                let item = arr[i];
                if (foundCollegeID === false){
                    foundCollegeID = true;
                    collegeID = item.CollegeID;
                    let res = await dbconnect.newSchemaToDB(collegeID); 
                }
                let res = await dbconnect.insertTeacherTakesToDB(
                                item.CollegeID, 
                                item.InterviewSiteName, 
                                item.StartTime, 
                                item.EndTime, 
                                item.TeacherID, 
                                item.TeacherName, 
                                item.Email, 
                                item.PhoneNumber,
                                item.DeptName);
                res = JSON.parse(res);
                if (res.legal === false){
                    console.log("Error in inserting teachers' info!");
                    return;
                }
            }
        }
        if (data.hasOwnProperty("student")){
            let arr = data.student;
            for (let i = 0; i < arr.length; i++){
                let item = arr[i];
                if (foundCollegeID === false){
                    foundCollegeID = true;
                    collegeID = item.CollegeID;
                    let res = await dbconnect.newSchemaToDB(collegeID);
                }
                let res = await dbconnect.insertStudentTakesToDB(
                                item.CollegeID, 
                                item.InterviewSiteName, 
                                item.StartTime, 
                                item.EndTime, 
                                item.StudentID, 
                                item.StudentName, 
                                item.Email, 
                                item.PhoneNumber);
                res = JSON.parse(res);
                if (res.legal === false){
                    console.log("Error in inserting students' info!");
                    return;
                }
            }
        }
        if (collegeID !== null){
            let result = await dbconnect.buildTablesToDB(collegeID);
            result = JSON.parse(result);
        }
    });
}

function handleUpload(req, res, realpath, id, collegeId){
    // realpath like "/videos/6000060/1.mp4" or /images/xxx.jpg
    if (!realpath)
        return illegalRequest;
    if (req.method.toLowerCase() !== "post")
        return illegalRequest;

    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = "./files";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        // rename file
        console.log("[handleUpload] realpath = " + realpath);
        realpath = form.uploadDir + realpath;
        let targetDir = path.dirname(realpath);
        if (!fs.existsSync(targetDir)) {  
            console.log("[handleUpload] creating new dir " + targetDir);
            fs.mkdir(targetDir);  
        }  
        let fileExt = realpath.substring(realpath.lastIndexOf('.'));  
        fs.rename(files.img.path, realpath, function(err){
            if(err){ throw Error("Error in renaming!"); }
        });
        
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) !== -1){
            dbconnect.setImgURLToDB(collegeId, id, '/images/' + files.img.name);
            let ret = {
                "type": "upload_info", 
                "status": "success"
            }
            responseJson(res, ret);
        } else if ('.mp4'.indexOf(fileExt.toLowerCase()) !== -1) {
            let interviewId = collegeId + id;
            console.log("[handleUpload] interviewId = " + interviewId);
            let hash = dbconnect.computeHash(realpath);
            let arg = {
                videoID: interviewId,
                index: parseInt(path.basename(realpath)),
                hash: hash
            }
            
            chain.verifyOneHashFromChain(arg, function(data){
                let dataInfo = JSON.parse(data);
                if (data.result != "success"){
                    let ret = {
                        "type": "upload_info", 
                        "status": "failure"
                    }
                    responseJson(res, ret);
                    return;
                }
                    
                let dirPath = "./files/videos/" + interviewId;
                let videosInfoPath =  dirPath + "/info.json";
                if (!fs.existsSync(videosInfoPath)){
                    console.log("[handleUpload] create " + interviewId + "/info.json");
                    let info = {
                        counts: 0,
                        urls: []
                    };
                    fs.writeFileSync(videosInfoPath, JSON.stringify(info));
                }
                let videoInfo = JSON.parse(fs.readFileSync(videosInfoPath));
                videoInfo.count = videoInfo.count + 1;
                videoInfo.urls.push(realpath);
                console.log("VIDEO INFO");
                console.log(videoInfo);    
                let ret = {
                    "type": "upload_info", 
                    "status": "success"
                }
                responseJson(res, ret);
            });
        }
        
    });
}

function handleSite(res, realpath){
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

async function handleDownload(res, realpath){
    let filePath = "./files/" + realpath;
    if (!await fs.existsSync(filePath)){
        responseError(res, "Download request " + realpath + " was not found on this server.");
        return;
    }
    res.writeHead(200,{  
        'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件  
        'Content-Disposition': 'attachment; filename=' + path.basename(filePath) //告诉浏览器这是一个需要下载的文件  
    });
    fs.createReadStream(filePath).pipe(res);
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
    return ipv4;
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

/**
 *  /validate?siteid=0001&validatecode=0001
 */
async function getInterviewInfo(collegeId, siteId, validateCode){
    if(!siteId || !validateCode)
        return illegalRequest;

    console.log("OOOOOO"+collegeId);
    let resStr = await dbconnect.getInterViewInfoFromDB(collegeId, siteId, validateCode);
    let res = JSON.parse(resStr);
     
    return res;
}

/**
 * /side?siteid=0001&side=teacher
 */
async function chooseSide(collegeId, siteId, side){
    console.log("chooseSide");
    console.log(siteId);
    console.log(side);

    if (!siteId || !side)
        return illegalRequest;

    let str = await dbconnect.checkSideFromDB(collegeId, siteId, side);
    let res = JSON.parse(str);
    
    // false means side is available
    if (res.result == 'false'){
        await dbconnect.chooseSideToDB(collegeId, siteId, side);
        return permission;
    }
    return denyPermission;
}

/**
 * /order?collegeid=77&siteid=7703&order=第2场
 */
async function chooseOrder(collegeId, siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let str = await dbconnect.checkOrderFromDB(collegeId, siteId, order);
    let res = JSON.parse(str);

    if (res.result  === "false"){
        let retval = await dbconnect.chooseOrderToDB(collegeId, siteId, order);
        retval = JSON.parse(retval);
        retval.type = "permission";
        retval.permission = "true";
        retval.error = null;
        console.log("[chooseOrder]");
        console.log(retval);
        return retval;
    }
    return denyPermission;
}

/**
 * /teacher?siteid=0001&order=01&id=11990001
 */
async function teacherSignin(collegeId, siteId, order, id){
    if (!siteId || !order || !id)
        return illegalRequest;

    // simply discard order information
    let str = await dbconnect.checkTeacherSigninFromDB(collegeId, siteId, order, id);
    let res = JSON.parse(str);

    if (res.result  === "true"){
        await dbconnect.teacherSigninToDB(collegeId, siteId, order, id);
        return permission;
    }
    return denyPermission;
}

/**
 * /querystudent?siteid=0001&order=01
 */
async function queryStudent(collegeId, siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let result = {"type": "signin_info"};
    
    let str = await dbconnect.queryStudentFromDB(collegeId, siteId, order);
    let res = JSON.parse(str);

    result.info = res.info;
    return result;
}

/**
 * /start?siteid=0001&order=01
 */
async function start(collegeId, siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    // simply discard order information
    let str = await dbconnect.startInterviewToDB(collegeId, siteId, order);
    let res = JSON.parse(str);
    if (res.oldStartTimeRecord === "null"){
        return permission;
    }
    return denyPermission;   
}

/**
 * /end?siteid=0001&order=01
 */
async function end(collegeId, siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    await dbconnect.endInterviewToDB(collegeId, siteId, order);
    return permission;
}

/**
 * /queryorder?siteid=0001
 */
async function queryOrder(collegeId, siteId){
    // IMPORTANT:
    // current pair relation must be (TEACHER WAIT FOR STUDENT) 
    // if so, return true
    if (!siteId)
        return illegalRequest;

    let str = await dbconnect.studentQueryOrderFromDB(collegeId, siteId);
    let res = JSON.parse(str);
    return res;
}

/**
 * /student?siteid=0001&order=01&id=11990001
 */
async function studentSignin(collegeId, siteId, order, id){
    if (!siteId || !order || !id)
        return illegalRequest;

    let str = await dbconnect.checkStudentSigninFromDB(collegeId, siteId, order, id);
    let res = JSON.parse(str);
    if (res.result  === "true"){
        await dbconnect.studentSigninToDB(collegeId, siteId, order, id);
        return permission;
    }
    return denyPermission;
}

/**
 * /querystart?siteid=0001&order=01
 */
async function queryStart(collegeId, siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let str = await dbconnect.checkStartFromDB(collegeId, siteId, order);
    let res = JSON.parse(str);

    if (res.result === "true"){
        return permission;
    }
    return denyPermission;
}

/**
 * /queryend?siteid=0001&order=01
 */
async function queryEnd(collegeId, siteId, order){
    if (!siteId || !order)
        return illegalRequest;

    let str = await dbconnect.checkEndFromDB(collegeId, siteId, order);
    let res = JSON.parse(str);

    if (res.result === "true"){
        return permission;
    }
    return denyPermission;
}