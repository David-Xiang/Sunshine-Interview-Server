"use strict";
let dbhost = "59.110.174.238";
let http = require("http");
let url = require("url");
let os = require("os");
let fs = require("fs");
let path = require("path");
let formidable = require("formidable");
let mime = require("./mime").types;
let dbmodule = require("./db_connect");
let dbconnect = new dbmodule(dbhost);
let chain = require("./chain")();
let ip = "162.105.175.243";
let slaves = [
    {
        ip: "123.56.150.39",
        port: 80
    },{
       ip: "47.106.38.23",
       port: 80
    }
];

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

let session = {};

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
            responseJson(res, result);
            break;
        case "/validate": 
            result = await getInterviewInfo(
                query["siteid"].substring(0, query["siteid"].length-2), 
                query["siteid"], 
                query["validatecode"]);
            responseJson(res, result);
            break;
        case "/side":
            result = await chooseSide(
                query["collegeid"], 
                query["siteid"], 
                query["side"]);
            responseJson(res, result);
            break;
        case "/order":
            result = await chooseOrder(
                query["collegeid"], 
                query["siteid"], 
                query["order"]);
            responseJson(res, result);
            break;
        case "/skip":
            result = await skipSignin(
                query["collegeid"],
                query["siteid"],
                query["order"]
            );
            responseJson(res, result);
            break;
        case "/teacher":
            result = await teacherSignin(
                query["collegeid"], 
                query["siteid"], 
                query["order"], 
                query["id"]);
            responseJson(res, result);
            break;
        case "/querystudent":
            result = await queryStudent(
                query["collegeid"], 
                query["siteid"], 
                query["order"]);
            responseJson(res, result);
            break;
        case "/start":
            result = await start(
                query["collegeid"], 
                query["siteid"], 
                query["order"]);
            responseJson(res, result);
            break;
        case "/end":
            result = await end(
                query["collegeid"], 
                query["siteid"], 
                query["order"]);
            responseJson(res, result);
            break;
        case "/queryorder":
            result = await queryOrder(
                query["collegeid"], 
                query["siteid"]);
            responseJson(res, result);
            break;
        case "/student":
            result = await studentSignin(
                query["collegeid"], 
                query["siteid"], 
                query["order"], 
                query["id"]);
            responseJson(res, result);
            break;
        case "/querystart":
            result = await queryStart(
                query["collegeid"], 
                query["siteid"], 
                query["order"]);
            responseJson(res, result);
            break;
        case "/queryend":
            result = await queryEnd(
                query["collegeid"], 
                query["siteid"], 
                query["order"]);
            responseJson(res, result);
            break;
        case "/upload":
            // path like "/videos/6000060/1.mp4"
            handleUpload(
                req, 
                res, 
                pathinfo.path, 
                query["id"], 
                query["collegeid"], 
                query["interviewid"]);
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
        case "/apis":
            switch(pathinfo.path){
                case "/login":
                    handleLogin(req, res);
                    break;
                case "/register":
                    handleRegister(req, res);
                    break;
                case "/sitetable":
                    handleSiteTable(req, res, query["collegeid"]);
                    break;
                case "/search":
                    handleSearch(req, res);
                    break;
            }
            break;
        case "/addhash":
            handleAddHash(
                req, res, 
                query["interviewid"], 
                query["index"], 
                query["hash"]);
            break;
        case "/verifyhash":
            handleVerifyHash(req, res, query["interviewid"]);
            break;
        case "/tableprocess":
            handleTableProcess(req, res, query["sessionid"]);
            break;
        default:
            result = illegalRequest;
            responseJson(res, result);
            break;
    }
});

server.listen(80);
console.log("Server starts on port " + 80);
//ip = showLocalIP();

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
    if(text === undefined)
        res.write("Error");
    else 
        res.write(text);
    res.end();
}

function handleTableProcess(req, res, sessionId){
    console.log("[handleTableProcess]");
    console.log(session.sessionId);
    responseJson(res, session.sessionId);
}

function handleAddHash(req, res, interviewId, index, hash){
    index = parseInt(index);
    if (!Number.isInteger(index)){
        console.log("[handleAddHash index is not a integer ");
        responseError(res, "index is not a valid integer");
        return;
    }
    console.log("[handleAddHash] arguments: ");
    console.log(interviewId);
    console.log(index);
    console.log(hash);
    responseJson(res, permission);
    let videoId = interviewId + "";
    console.log("[[handleAddHash] interviewId" );
    console.log(interviewId);
    // for (let i = 0; i < 4-String(index).length; i++)
    //     videoId = videoId + "0";
    // videoId += index;
    let arg = {
        videoID: videoId,
        index,
        hash
    }
    let collegeId = interviewId.substring(0, 2);
    dbconnect.setBlockStringToDB(collegeId, interviewId, hash);
    dbconnect.updateAfterInterviewToDB(collegeId, interviewId);
    console.log("[handleAddHash] arg: ");
    console.log(arg);
    chain.addHashToChain(arg, function(data){
        console.log(data);
        //responseJson(res, data);
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
        if (!reqJson.studentID || !reqJson.source){
            responseError(res, "Params incomplete");
        }
        let data =  await dbconnect.
                          webValidateCertificationFromDB(reqJson.studentID);
        data = JSON.parse(data);
        if (data.legal == "false"){
            responseJson(res, illegalRequest);
            return;
        }

        //let data = {interviewID: 660001};
        
        if (reqJson.source == "0"){
            let videoInfo = JSON.parse(fs.readFileSync("./files/videos/" + 
                                        data.interviewID + "/info.json"));
            console.log("VIDEO INFO");
            console.log(videoInfo);
            let arr = videoInfo.info;
            for (let i = 0; i < arr.length; i++){
                arr[i].url = `http://${ip}/download${arr[i].url}`;
            }
            data.videos = videoInfo;

            getHashsFromChain(data, (result)=>{
                res.write(JSON.stringify(result));
                res.end();
            });
            return;
        }
        
        try{
            let slave = slaves[parseInt(reqJson.source)-1];
            let option = {
                host: slave.ip, 
                path: `/videoinfo?id=${data.interviewID}`, 
                port: slave.port,
                method: 'GET'
            };
            let client = http.request(option, function(res1){
                let msg = '';
                res1.on('data', function(chunk){
                    msg += chunk;
                });
                res1.on('end', function(){
                    console.log(msg);
                    let videoInfo = JSON.parse(msg);
                    let arr = videoInfo.info;
                    for (let i = 0; i < arr.length; i++)
                        arr[i].url = `http://${slave.ip}:${slave.port}/download${arr[i].url}`;
                    data.videos = videoInfo;
                    getHashsFromChain(data, (result)=>{
                        res.write(JSON.stringify(result));
                        res.end();
                    });
                });
            });
            client.end();
        } catch (err){
            console.log("[handleSearch] Error1!!!!");
            responseError(res);
        }
    });
}

function getHashsFromChain(result, callback){
    let arg = {
        videoID: result.interviewID, 
    }
    chain.getHashsFromChain(arg, (data)=>{
        let dataInfo = JSON.parse(data.data);
        if (dataInfo.status != "Success"){
            console.log("[getHashsFromChain] WARNING: error in connection with chain");
            console.log(dataInfo);
            return;
        }
        
        console.log("[getHashsFromChain]");

    try{
            let hashs = JSON.parse(dataInfo.result);
            result.videos.info.map(v => v.hashChain = hashs[v.index]);
        } catch (err) {
            console.log("\n\n[getHashsFromChain]Error 01!!!!!!!!!\n\n");
        }    
    callback(result);
    });
}

async function handleSiteTable(req, res, CollegeID){
    let data = await dbconnect.webGetSiteTableFromDB(CollegeID);
    responseText(res, data);
}

async function handleLogin(req, res){
    console.log("[handleLogin]");
    let dataStr = "";
    req.on('data', function (chunk) {
        dataStr += chunk;
    });
    req.on('end', async function(){
        dataStr = decodeURI(dataStr);
        let reqJson = JSON.parse(dataStr);
        console.log(reqJson);
        if (typeof(reqJson.username) !== "string" || 
            typeof(reqJson.password) !== "string"){
            responseJson(res, illegalRequest);
            return;
        }

        let info = null;
        switch (reqJson.loginState){
            case "student":
                info = await dbconnect.webValidateCertificationFromDB(
                    reqJson.password, reqJson.username);
                    
                info = JSON.parse(info);
                info.videos = JSON.parse(fs.readFileSync(`./files/videos/${info.interviewID}/info.json`));
                let urlInfo = JSON.parse(await dbconnect.getImgURLFromDB(info.collegeID, info.studentID));
                info.imageUrl = `http://${ip}/download${urlInfo.result}`;
                responseJson(res, info);
                break; 
            case "teacher":
                info = await dbconnect.webValidateInformationFromDB(
                    reqJson.username, reqJson.password);
                responseText(res, info);
                break; 
            case "school":
                info = await dbconnect.webValidateVideoFromDB(
                    reqJson.username, reqJson.password);
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
        let sessionId = Math.random().toString(36).slice(-8);
        responseJson(res, { sessionId });
        session.sessionId = {
            total: 0,
            inserted: 0 
        };
        let data = JSON.parse(dataStr);
        let collegeID = null;
        if (data.hasOwnProperty("teacher")){
            session.sessionId.total += data.teacher.length;
        } 
        if (data.hasOwnProperty("student")){
            session.sessionId.total += data.student.length;
        }
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
                session.sessionId.inserted++;
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
                session.sessionId.inserted++;
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

function handleUpload(req, res, realpath, id, collegeId, interviewId){
    // realpath like "/videos/6000060/1.mp4" or /images/xxx.jpg
    collegeId = collegeId || interviewId.substring(0, 2);
    if (!realpath)
        responseJson(res, illegalRequest);
    if (req.method.toLowerCase() !== "post")
        responseJson(res, illegalRequest);

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
            fs.mkdirSync(targetDir);  
        }  
        let fileExt = realpath.substring(realpath.lastIndexOf('.'));  
        fs.renameSync(files.img.path, realpath);
        
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) !== -1){
            dbconnect.setImgURLToDB(collegeId, id, 
                '/images/' + files.img.name);
            let ret = {
                "type": "upload_info", 
                "status": "success"
            }
            responseJson(res, ret);
        } else if ('.mp4'.indexOf(fileExt.toLowerCase()) !== -1) {
            dbconnect.updateAfterInterviewToDB(collegeId, interviewId);
            // store hash and video locally
            console.log("[handleUpload] interviewId = " + interviewId);
            let hash = dbconnect.computeHash(realpath);
            //dbconnect.setBlockStringToDB(collegeId, interviewId, hash);
            let arg = {
                videoID: interviewId,
                index: parseInt(path.basename(realpath)),
                hashFile: hash
            }
            console.log("[handleUpload] upload videos success.");

            let dirPath = "./files/videos/" + interviewId;
            let videosInfoPath =  dirPath + "/info.json";
            if (!fs.existsSync(videosInfoPath)){
                let info = {
                    count: 0,
                    info: []
                };
                fs.writeFileSync(videosInfoPath, JSON.stringify(info));
            }
            let videoInfo = JSON.parse(fs.readFileSync(videosInfoPath));
            videoInfo.count = videoInfo.count + 1;
            videoInfo.info.push({
                url: realpath.substring(7, realpath.length),
                index: parseInt(path.basename(realpath)),
                hashFile: hash
            });
            console.log("[handleUpload] videoInfo:");
            console.log(videoInfo);
            fs.writeFileSync(videosInfoPath, JSON.stringify(videoInfo));

            responseJson(res, permission);
            
                     
            // verify hash from chain
            verifyOneHashFromChain(arg);

            sendVideoToSlaves(realpath);
            sendInfoToSlaves(videoInfo, interviewId);
        }
        
    });
}

function verifyOneHashFromChain(arg){
    chain.verifyOneHashFromChain(arg, function(data){
        let dataInfo = JSON.parse(data.data);
        if (dataInfo.status != "Success"){
            console.log("[verifyOneHashFromChain] WARNING: dataInfo");
            console.log(dataInfo);
            return;
        }   
    });
}

function sendVideoToSlaves(filepath){
    filepath = filepath.substr(7);
    for (let slave of slaves){
        console.log("[sendVideoToSlaves]: slave");
        console.log(slave);
        let realpath = "./files/" + filepath;
        fs.exists(realpath, function(exist){
            let option = {
                host: slave.ip, 
                path: '/upload' + filepath, 
                port: slave.port,
                method: 'POST',
            };
            let client = http.request(option, function(res){
                let data = '';
                res.on('data', function(chunk){
                    data += chunk;
                });
                res.on('end', function(){
                    console.log(data);
                });
            });
            let downUrl = "http://" + ip  + "/download" + filepath;
            client.write(downUrl);
            client.end();
        });
    }
}

function sendInfoToSlaves(info, interviewId){
    for (let slave of slaves){
        let option = {
            host: slave.ip, 
            path: `/videoinfo?id=${interviewId}`, 
            port: slave.port,
            method: 'POST'
        };
        let client = http.request(option, function(res){
            let data = '';
            res.on('data', function(chunk){
                data += chunk;
            });
            res.on('end', function(){
                console.log(data);
            });
        });
        client.write(JSON.stringify(info));
        client.end();
    }
}

function handleSite(res, realpath){
    fs.exists(realpath, function(exist){
        if (!exist){
            responseError(res, "This request URL " + realpath 
                + " was not found on this server.");
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
    console.log("[handleDownload]filePath:");
    console.log(filePath);
    if (!fs.existsSync(filePath)){
        responseError(res, "Download request " + realpath 
        + " was not found on this server.");
        return;
    }
    res.writeHead(200,{  
        'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件  
        'Content-Disposition': 'attachment; filename=' 
        + path.basename(filePath) //告诉浏览器这是一个需要下载的文件
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
    let resStr = await dbconnect.getInterViewInfoFromDB(
                        collegeId, siteId, validateCode);
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
 * /skip?siteid=0001&collegeid=01&order=01 
 */
async function skipSignin(collegeId, siteId, order){
    if (!collegeId || !order || !siteId)
        return illegalRequest;
    let result = await dbconnect.skipSigninToDB(collegeId, siteId, order);
    result = JSON.parse(result);
    result.type = "permission";
    result.permission = "true";
    result.error = null;
    await dbconnect.startInterviewToDB(collegeId, siteId, order);
    
    return result;
}

/**
 * /teacher?siteid=0001&order=01&id=11990001
 */
async function teacherSignin(collegeId, siteId, order, id){
    if (!siteId || !order || !id)
        return illegalRequest;

    // simply discard order information
    let str = await dbconnect.checkTeacherSigninFromDB(
                    collegeId, siteId, order, id);
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
    for (let i = 0; i < result.info.length; i++){
        let item = result.info[i];
        if (item["img_url"] !== "null")
            item["img_url"] = `http://${ip}/download${item["img_url"]}`;
    }
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

    let str = await dbconnect.checkStudentSigninFromDB(
                    collegeId, siteId, order, id);
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
