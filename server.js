"use strict";
let http = require("http");
let url = require("url");
let os = require("os");

let server = http.createServer(function(req, res) {
    console.log("");
    console.log("Received request " + req.url);
    let pathname = url.parse(req.url).pathname;
    let query = {};
    if (url.parse(req.url).query !== null)
        query = parseQueryString(url.parse(req.url).query);
    
    //console.log("Pathname: " + pathname);
    //console.log("Query: ");
    //console.log(query);

    res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
    let result = {};
    switch(pathname){
        case "/":
            result = {};
            break;
        case "/validate": 
            result = getInterviewInfo(query["siteid"], query["validatecode"]);
            break;
        case "/side":
            result = chooseSide(query["siteid"], query["side"]);
            break;
        case "/order":
            result = chooseOrder(query["siteid"], query["order"]);
            break;
        case "/teacher":
            result = teacherSignin(query["siteid"], query["order"], query["id"]);
            break;
        case "/querystudent":
            result = queryStudent(query["siteid"], query["order"]);
            break;
        case "/start":
            result = start(query["siteid"], query["order"]);
            break;
        case "/end":
            result = end(query["siteid"], query["order"]);
            break;
        case "/queryorder":
            result = queryOrder(query["siteid"]);
            break;
        case "/student":
            result = studentSignin(query["siteid"], query["order"], query["id"]);
            break;
        case "/querystart":
            result = queryStart(query["siteid"], query["order"]);
            break;
        case "/queryend":
            result = queryEnd(query["siteid"], query["order"]);
            break;
        default:
            result = { "type": "error", "message": "wrong pathname"}
    }
    if (result.type === "error"){
        console.log("Error: " + result.message);
        res.end();
        return;
    }
    res.write(JSON.stringify(result));
    res.end();
});

server.listen(80);
console.log("Server starts on port " + 80);
showLocalIP();

/** 
 * Utilities
 */
let truePermission = {
    "type": "permission",
    "permission": "true"
};
let falsePermission = {
    "type": "permission",
    "permission": "false"
};
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
function getInterviewInfo(siteId, validateCode){
    // TODO: validate site
    if (validateFromDB(siteId, validateCode) === true){
        return getInterViewInfoFromDB(siteId, validateCode);
    } else {
        return {
            "type": "interview_info",
            "permission": "false"
        };
    }
}

function validateFromDB(siteId, validateCode){
    // TODO
    return true;
}

function getInterviewInfoFromDB(siteId, validateCode){
    // TODO
    return {
        "type": "interview_info",
        "permission": "true",
        "info":{
            "college_id": "01",
            "college_name": "北清大学",
            "site_id": "0001",
            "site_name": "文史楼110",
            "periods":[{
                    "order": "01",
                    "start_time": "2019-06-11 09:00:00",
                    "end_time": "2019-06-11 09:00:00",
                    "teacher":[
                        {
                            "id": "11999999",
                            "name": "东老师"
                        }
                    ],
                    "student":[
                        {
                            "id":"11990001",
                            "name": "宋煦"
                        },
                        {
                            "id":"11990002",
                            "name": "何炬"
                        }
                    ]
                }
            ]
        }
    };
}

/**
 * /side?siteid=0001&side=teacher
 */
function chooseSide(siteId, side){
    if (checkSideFromDB(siteId, side) === true){
        chooseSideToDB(siteId, side);
        return truePermission;
    }
    return falsePermission;
} 
function checkSideFromDB(siteId, side){
    // TODO
    // if this side hasn't been chosen, return true
    return true;
}
function chooseSideToDB(siteId, side){
    // TODO
}

/**
 * /order?siteid=0001&order=01 
 */
function chooseOrder(siteId, order){
    if (checkOrderFromDB(siteId, order) === true){
        chooseOrderToDB(siteId, order);
        return truePermission;
    }
    return falsePermission;
}
function checkOrderFromDB(siteId, order){
    // TODO
    // if this order hasn't been chosen, return true
    return true;
}
function chooseOrderFromDB(siteId, order){
    // TODO
    // IMPORTANT
    // set current pair relation to (TEACHER WAIT FOR STUDENT)
}

/**
 * /teacher?siteid=0001&order=01&id=11990001
 */
function teacherSignin(siteId, order, id){
    // simply discard order information
    if (checkTeacherSigninFromDB(siteId, id) === true){
        teacherSigninToDB(siteId, id);
        return truePermission;
    }
    return falsePermission;
}
function checkTeacherSigninFromDB(siteId, id){
    // TODO
    // if this person hasn't been chosen, return true
    // VERY IMPORTANT: 
    // we suppose once a teacher has sign in this site in previous order,
    // he won't need to sign in again
    // (student won't sign in repeatedly)
    return true;
}
function teacherSigninToDB(siteId, id){
    // TODO
}

/**
 * /querystudent?siteid=0001&order=01
 */
function queryStudent(siteId, order){
    let result = {"type": "signin_info"};
    result.info = queryStudentFromDB(siteId, order);
    return result;
}
function queryStudentFromDB(siteId, order){
    // return a list of student info consists of id, name, is_absent and img_url
    return [
        {
            "id":"11990001",
            "name": "何炬",
            "is_absent": "false",
            "img_url": "http://10.0.0.1/img/11990001.jpg" 
        },
        {
            "id":"11990002",
            "name": "宋煦",
            "is_absent": "true",
            "img_url": ""
        }
    ];
}

/**
 * /start?siteid=0001&order=01
 */
function start(siteId, order){
    startInterviewToDB(siteId, order);
    return truePermission;    
}
function startInterviewToDB(siteId, order){
    // TODO
}


/**
 * /end?siteid=0001&order=01
 */
function end(siteId, order){
    endInterviewToDB(siteId, order);
    return truePermission;
}
function endInterviewToDB(siteId, order){
    // TODO
}

/**
 * /queryorder?siteid=0001
 */
function queryOrder(siteId){
    // IMPORTANT:
    // current pair relation must be (TEACHER WAIT FOR STUDENT) 
    // if so, return true
    return truePermission;
}

/**
 * /student?siteid=0001&order=01&id=11990001
 */
function studentSignin(siteId, order, id){
    // simply discard order information
    if (checkStudentSigninFromDB(siteId, id) === true){
        studentSigninToDB(siteId, id);
        return truePermission;
    }
    return falsePermission;
}
function checkStudentSigninFromDB(siteId, id){
    // TODO
    // if this person hasn't been chosen, return true
    // VERY IMPORTANT: 
    // we suppose once a teacher has sign in this site in previous order,
    // he won't need to sign in again
    // (student won't sign in repeatedly)
    return true;
}
function studentSigninToDB(siteId, id){
    // TODO
}

/**
 * /querystart?siteid=0001&order=01
 */
function queryStart(siteId, order){
    if (checkStartFromDB(siteId, order) === true){
        return truePermission;
    }
    return falsePermission;
}
function checkStartFromDB(siteId, order){
    return true;
}

/**
 * /queryend?siteid=0001&order=01
 */
function queryEnd(siteId, order){
    if (checkEndFromDB(siteId, order) === true){
        return truePermission;
    }
    return falsePermission;
}
function checkEndFromDB(siteId, order){
    return true;
}