/*************************************************
Copyright		: Sunshine
Author			: Xu
Startdate		: 2019-03-19 22:19:12
Finishdate		: 2019-04-28 03:46:07
Description		: May codes no BUGs
**************************************************/

module.exports = function(host){
	let myconnect = 
	{
		host :			 host,
		user :			 'root',
		password :		 'password',
		port :			 '3306',
		database :		 'sunshine',
		timezone :		 '+8:00',
		dateStrings :	 true
	};
	const mysql = require("mysql2/promise");
	const fs = require("fs");
	const os = require("os");
	const crypto = require('crypto');
	const showDetails = true;
	const showJson = true;
	const hostfromtxt = false;
	const logUpdate = true;
	const MB = 1024 * 1024;
	
	Date.prototype.Format = function(fmt)
	{
		let o =
		{
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"S": this.getMilliseconds()
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	
	this.sleep = function (sleepTime)/* Just a tool */
	{
		for(var start = +new Date; +new Date - start <= sleepTime; ) { } 
	}
	
	function getIPAdress()/* Just a tool */
	{  
		let interfaces = os.networkInterfaces();
		let tmpAddress;
		for(let devName in interfaces)
		{
			let iface = interfaces[devName];
			for(let i = 0; i < iface.length; i++)
			{
				let alias = iface[i];
				if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
				{
					tmpAddress = alias.address;
					//console.log(tmpAddress);
					if (alias.address.substr(0, 3) != '192') return alias.address;
				}
			}
		}
		return tmpAddress;
	}

	function tracer_funTrueFalseDate(key, value)/* Just a tool */
	{
		if (value == 0) return "false";
		if (value == 1) return "true";
		if (value == null) return "null";
		if (key == "oldChosenTime" || key == "newChosenTime")
		{
			return value.substr(0, 19).replace("T"," ");
		}
		return value;
	}

	function tracer_Date(key, value)/* Just a tool */
	{
		if (value == null) return "null";
		if (key == "oldChosenTime" || key == "newChosenTime")
		{
			return value.substr(0, 19).replace("T"," ");
		}
		return value;
	}

	this.logUpdateToDB = async function (collegeId, functionName)/* Just a tool */
	{
		if (!logUpdate) return;
		myconnect.database = "sunshine_" + collegeId;
		let nowTime = new Date();
		let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
		let nowIP = getIPAdress();
		let connection = await mysql.createConnection(myconnect);
		await connection.execute("INSERT INTO logdata(LogID, LogTime, FunctionName, IP) VALUES (null," + nowTime_db + ", '" + functionName + "', '" + nowIP + "');");
		let [rows, fields] = await connection.execute("SELECT LogCount from info where CollegeID = " + collegeId + ";");
		let count = rows[0].LogCount;
		count++;
		await connection.execute("UPDATE info SET LogCount = " + count + " where CollegeID = " + collegeId + ";");
		await connection.end();
	}
	
	this.computeHash = function (fileName)/* A new tool */
	{
		// [Xu] Exp: computeHash("1.mp4");
		if (showDetails) console.log("[Start computeHash('" + fileName + "')]");
		let stats = fs.statSync(fileName);
		let startReadTime = new Date();
		let data = fs.readFileSync(fileName);
		let endReadTime = new Date();
		let startHashTime = new Date();
		//console.log(startHashTime);
		let hash = crypto.createHash('md5');
		hash.update(data);
		let hashString = hash.digest('hex');
		let endHashTime = new Date();
		//console.log(endHashTime);
		//console.log(Math.round(endHashTime - startHashTime) / 1000);
		//console.log(hashString);
		let res = {};
		res.fileName = fileName;
		res.size_mb = Math.round(stats.size / MB * 100) / 100;
		res.sizeString = res.size_mb + " Mb";
		res.timeRead_s = Math.round(endReadTime - startReadTime) / 1000;
		res.timeReadString = res.timeRead_s + " s";
		res.timeHash_s = Math.round(endHashTime - startHashTime) / 1000;
		res.timeHashString = res.timeHash_s + " s";
		res.hashString = hashString;
		res.return = hashString;
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(res);
		if (showDetails) console.log("[End computeHash('" + fileName + "')]\n");
		return hashString;
	}

	this.validateFromDB = async function (collegeId, siteId, validateCode)/* fun01 */
	{
		// [Xu] Exp: validateFromDB("1101", "1101");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "validateFromDB");
		if (showDetails) console.log("[Start validateFromDB('" + siteId + "','" + validateCode + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT Password FROM interviewsite where InterviewSiteID = " + siteId + ";");
		let res = {};
		res.functionName = "validateFromDB('" + siteId + "','" + validateCode + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.result = (rows[0].Password == validateCode);
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End validateFromDB('" + siteId + "','" + validateCode + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "validateFromDB('1101','1101')",
			"legal": "true",
			"result": "true"
		}
		********************** Example **********************/
	}

	this.chooseSideToDB = async function (collegeId, siteId, side)/* fun02 */
	{
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "chooseSideToDB");
		// [Xu] side MUST be "teacher", "TEACHER", "student" or "STUDENT"
		// [Xu] Exp: chooseSideToDB("1101", "teacher");
		if (showDetails) console.log("[Start chooseSideToDB('" + siteId + "','" + side + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "chooseSideToDB('" + siteId + "','" + side + "')]";
		if (side == "teacher" || side == "TEACHER")
		{
			res.legal = "true";
			res.side = "teacher";
			await connection.execute("UPDATE interviewsite SET TeacherSideChosen = 1 WHERE InterviewSiteID = " + siteId + "; ");
		}
		else if (side == "student" || side == "STUDENT")
		{
			res.legal = "true";
			res.side = "student";
			await connection.execute("UPDATE interviewsite SET StudentSideChosen = 1 WHERE InterviewSiteID = " + siteId + "; ");
		}
		else res.legal = "false"; // if illegal
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End chooseSideToDB('" + siteId + "','" + side + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "chooseSideToDB('1101','teacher')]",
			"legal": "true",
			"side": "teacher"
		}
		********************** Example **********************/
	}

	this.resetSideToDB = async function (collegeId, siteId, side)/* fun03 */ /* Contrary to fun02: chooseSideToDB */
	{
		// [Xu] side MUST be "teacher", "TEACHER", "student" or "STUDENT"
		// [Xu] Exp: resetSideToDB("1101", "teacher");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "resetSideToDB");
		if (showDetails) console.log("[Start resetSideToDB('" + siteId + "','" + side + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "resetSideToDB('" + siteId + "','" + side + "')]";
		if (side == "teacher" || side == "TEACHER")
		{
			res.legal = "true";
			res.side = "teacher";
			await connection.execute("UPDATE interviewsite SET TeacherSideChosen = 0 WHERE InterviewSiteID = " + siteId + "; ");
		}
		else if (side == "student" || side == "STUDENT")
		{
			res.legal = "true";
			res.side = "student";
			await connection.execute("UPDATE interviewsite SET StudentSideChosen = 0 WHERE InterviewSiteID = " + siteId + "; ");
		}
		else res.legal = "false"; // if illegal
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End resetSideToDB('" + siteId + "','" + side + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "resetSideToDB('1101','teacher')]",
			"legal": "true",
			"side": "teacher"
		}
		********************** Example **********************/
	}

	this.checkSideFromDB = async function (collegeId, siteId, side)/* fun04 */
	{
		// if this side hasn't been chosen, return true
		// [Xu] side MUST be "teacher", "TEACHER", "student" or "STUDENT"
		// [Xu] Exp: checkSideFromDB("1101", "teacher");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "checkSideFromDB");
		if (showDetails) console.log("[Start checkSideFromDB('" + siteId + "','" + side + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "checkSideFromDB('" + siteId + "','" + side + "')]";
		if (side == "teacher" || side == "TEACHER")
		{
			let [rows, fields] = await connection.execute("SELECT TeacherSideChosen FROM interviewsite where InterviewSiteID = " + siteId + ";");
			if (!rows[0]) res.legal = "false"; // if illegal
			else // if legal
			{
				res.legal = "true";
				res.side = "teacher";
				res.result = rows[0].TeacherSideChosen;
			}
		}
		else if (side == "student" || side == "STUDENT")
		{
			let [rows, fields] = await connection.execute("SELECT StudentSideChosen FROM interviewsite where InterviewSiteID = " + siteId + ";");
			if (!rows[0]) res.legal = "false"; // if illegal
			else // if legal
			{
				res.legal = "true";
				res.side = "student";
				res.result = rows[0].StudentSideChosen;
			}
		}
		else res.legal = "false"; // if illegal
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End checkSideFromDB('" + siteId + "','" + side + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkSideFromDB('1101','teacher')]",
			"legal": "true",
			"side": "teacher",
			"result": "false"
		}
		********************** Example **********************/
	}

	this.checkOrderFromDB = async function (collegeId, siteId, order)/* fun05 */
	{
		// if this order hasn't been chosen, return true
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: checkOrderFromDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "checkOrderFromDB");
		if (showDetails) console.log("[Start checkOrderFromDB('" + siteId + "','" + order + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "checkOrderFromDB('" + siteId + "','" + order + "')]";
		let [rows, fields] = await connection.execute("SELECT Chosen FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.result = rows[0].Chosen;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End checkOrderFromDB('" + siteId + "','" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkOrderFromDB('1101','2')]",
			"legal": "true",
			"result": "false"
		}
		********************** Example **********************/
	}

	this.chooseOrderToDB = async function (collegeId, siteId, order)/* fun06 */
	{
		// IMPORTANT
		// set current pair relation to (TEACHER WAIT FOR STUDENT)
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: chooseOrderToDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "chooseOrderToDB");
		if (showDetails) console.log("[Start chooseOrderToDB('" + siteId + "','" + order + "')]");
		let nowTime = new Date();
		let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
		let nowTime_js = nowTime.Format("yyyy-MM-dd hh:mm:ss");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT InterviewID as 'interviewID', Chosen as 'chosen', ChosenTime as 'chosenTime' FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "chooseOrderToDB('" + siteId + "','" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.oldChosen = rows[0].chosen;
			res.newChosen = "true";
			res.interviewID = rows[0].interviewID;
			res.oldChosenTime = rows[0].chosenTime;
			res.newChosenTime = nowTime_js;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.execute("UPDATE interview SET Chosen = 1, ChosenTime = " + nowTime_db + " where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		await connection.end();
		if (showDetails) console.log("[End chooseOrderToDB('" + siteId + "','" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "chooseOrderToDB('1101','2')",
			"legal": "true",
			"oldChosen": "true",
			"newChosen": "true",
			"oldChosenTime": "2019-03-21 02:33:40",
			"newChosenTime": "2019-03-21 02:36:55"
		}
		********************** Example **********************/
	}

	this.resetOrderFromDB = async function (collegeId, siteId, order)/* fun07 */ /* Contrary to fun06: chooseOrderToDB */
	{
		// IMPORTANT
		// set current pair relation to (TEACHER WAIT FOR STUDENT)
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: resetOrderFromDB("1102", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "resetOrderFromDB");
		if (showDetails) console.log("[Start resetOrderFromDB('" + siteId + "','" + order + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT Chosen as 'chosen', ChosenTime as 'chosenTime' FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "resetOrderFromDB('" + siteId + "','" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.oldChosen = rows[0].chosen;
			res.newChosen = "false";
			res.oldChosenTime = rows[0].chosenTime;
			res.newChosenTime = "null";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.execute("UPDATE interview SET Chosen = 0, ChosenTime = null where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		await connection.end();
		if (showDetails) console.log("[End resetOrderFromDB('" + siteId + "','" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "resetOrderFromDB('1102','2')",
			"legal": "true",
			"oldChosen": "true",
			"newChosen": "false",
			"oldChosenTime": "2019-03-21 02:38:24",
			"newChosenTime": "null"
		}
		********************** Example **********************/
	}

	this.teacherSigninToDB = async function (collegeId, siteId, order, id)/* fun08 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: teacherSigninToDB("1101", "2", "11990005");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "teacherSigninToDB");
		if (showDetails) console.log("[Start teacherSigninToDB('" + siteId + "', '" + order + "', '" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "teacherSigninToDB('" + siteId + "', '" + order + "', '" + id + "')";
		let [rows, fields] = await connection.execute("SELECT Signin FROM teacher_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and TeacherID = " + id + ";");
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			await connection.execute("UPDATE teacher_takes SET Signin = 1 where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and TeacherID = " + id + ";");
			res.legal = "true";
			res.oldSignin = rows[0].Signin;
			res.newSignin = "true";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End teacherSigninToDB('" + siteId + "', '" + order + "', '" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "teacherSigninToDB('1101', '2', '11990005')",
			"legal": "true",
			"oldSignin": "true",
			"newSignin": "true"
		}
		********************** Example **********************/
	}

	this.teacherSignoutToDB = async function (collegeId, siteId, order, id)/* fun09 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: teacherSignoutToDB("1101", "2", "11990005");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "teacherSignoutToDB");
		if (showDetails) console.log("[Start teacherSignoutToDB('" + siteId + "', '" + order + "', '" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "teacherSignoutToDB('" + siteId + "', '" + order + "', '" + id + "')";
		let [rows, fields] = await connection.execute("SELECT Signin FROM teacher_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and TeacherID = " + id + ";");
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			await connection.execute("UPDATE teacher_takes SET Signin = 0 where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and TeacherID = " + id + ";");
			res.legal = "true";
			res.oldSignin = rows[0].Signin;
			res.newSignin = "false";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End teacherSignoutToDB('" + siteId + "', '" + order + "', '" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "teacherSignoutToDB('1101', '2', '11990005')",
			"legal": "true",
			"oldSignin": "false",
			"newSignin": "false"
		}
		********************** Example **********************/
	}

	this.studentSigninToDB = async function (collegeId, siteId, order, id)/* fun10 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: studentSigninToDB("1101", "2", "11000001");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "studentSigninToDB");
		if (showDetails) console.log("[Start studentSigninToDB('" + siteId + "', '" + order + "', '" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "studentSigninToDB('" + siteId + "', '" + order + "', '" + id + "')";
		let [rows, fields] = await connection.execute("SELECT Signin FROM student_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and StudentID = " + id + ";");
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			await connection.execute("UPDATE student_takes SET Signin = 1 where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and StudentID = " + id + ";");
			res.legal = "true";
			res.oldSignin = rows[0].Signin;
			res.newSignin = "true";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End studentSigninToDB('" + siteId + "', '" + order + "', '" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "studentSigninToDB('1101', '2', '11000001')",
			"legal": "true",
			"oldSignin": "false",
			"newSignin": "true"
		}
		********************** Example **********************/
	}

	this.studentSignoutToDB = async function (collegeId, siteId, order, id)/* fun11 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: studentSignoutToDB("1101", "2", "11000001");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "studentSignoutToDB");
		if (showDetails) console.log("[Start studentSignoutToDB('" + siteId + "', '" + order + "', '" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "studentSignoutToDB('" + siteId + "', '" + order + "', '" + id + "')";
		let [rows, fields] = await connection.execute("SELECT Signin FROM student_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and StudentID = " + id + ";");
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			await connection.execute("UPDATE student_takes SET Signin = 0 where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and StudentID = " + id + ";");
			res.legal = "true";
			res.oldSignin = rows[0].Signin;
			res.newSignin = "false";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End studentSignoutToDB('" + siteId + "', '" + order + "', '" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "studentSignoutToDB('1101', '2', '11000001')",
			"legal": "true",
			"oldSignin": "true",
			"newSignin": "false"
		}
		********************** Example **********************/
	}

	this.startInterviewToDB = async function (collegeId, siteId, order)/* fun12 */
	{
		// [Xu] Exp: startInterviewToDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "startInterviewToDB");
		if (showDetails) console.log("[Start startInterviewToDB('" + siteId + "', '" + order + "')]");
		let nowTime = new Date();
		let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
		let nowTime_js = nowTime.Format("yyyy-MM-dd hh:mm:ss");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT StartTimeRecord FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "startInterviewToDB('" + siteId + "', '" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.oldStartTimeRecord = rows[0].StartTimeRecord;
			res.newStartTimeRecord = nowTime_js;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.execute("UPDATE interview SET StartTimeRecord = " + nowTime_db + " where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		await connection.end();
		if (showDetails) console.log("[End startInterviewToDB('" + siteId + "', '" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "startInterviewToDB('1101', '2')",
			"legal": "true",
			"oldStartTimeRecord": "null",
			"newStartTimeRecord": "2019-03-20 22:33:50"
		}
		********************** Example **********************/
	}

	this.endInterviewToDB = async function (collegeId, siteId, order)/* fun13 */
	{
		// [Xu] Exp: endInterviewToDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "endInterviewToDB");
		if (showDetails) console.log("[Start endInterviewToDB('" + siteId + "', '" + order + "')]");
		let nowTime = new Date();
		let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
		let nowTime_js = nowTime.Format("yyyy-MM-dd hh:mm:ss");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT EndTimeRecord FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "endInterviewToDB('" + siteId + "', '" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.oldEndTimeRecord = rows[0].EndTimeRecord;
			res.newEndTimeRecord = nowTime_js;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.execute("UPDATE interview SET EndTimeRecord = " + nowTime_db + " where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		await connection.end();
		if (showDetails) console.log("[End endInterviewToDB('" + siteId + "', '" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "endInterviewToDB('1101', '2')",
			"legal": "true",
			"oldEndTimeRecord": "null",
			"newEndTimeRecord": "2019-03-20 22:36:30"
		}
		********************** Example **********************/
	}

	this.resetTimesOfInterviewToDB = async function (collegeId, siteId, order)/* fun14 */ /* Set StartTimeRecord, EndTimeRecord, ChosenTime to null and Set Chosen to 0(default value)*/
	{
		// [Xu] Exp: resetTimesOfInterviewToDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "resetTimesOfInterviewToDB");
		if (showDetails) console.log("[Start resetTimesOfInterviewToDB('" + siteId + "', '" + order + "')]");
		let defaultTime = "null";
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT StartTimeRecord, EndTimeRecord, Chosen, ChosenTime FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "resetTimesOfInterviewToDB('" + siteId + "', '" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.oldStartTimeRecord = rows[0].StartTimeRecord;
			res.newStartTimeRecord = defaultTime;
			res.oldEndTimeRecord = rows[0].EndTimeRecord;
			res.newEndTimeRecord = defaultTime;
			res.oldChosen = rows[0].Chosen;
			res.newChosen = "false";
			res.oldChosenTime = rows[0].ChosenTime;
			res.newChosenTime = defaultTime;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.execute("UPDATE interview SET StartTimeRecord = " + defaultTime + ", EndTimeRecord = " + defaultTime + ", Chosen = 0, ChosenTime = " + defaultTime + " where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		await connection.end();
		if (showDetails) console.log("[End resetTimesOfInterviewToDB('" + siteId + "', '" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "resetTimesOfInterviewToDB('1101', '2')",
			"legal": "true",
			"oldStartTimeRecord": "2019-03-20 22:34:12",
			"newStartTimeRecord": "null",
			"oldEndTimeRecord": "2019-03-20 22:36:30",
			"newEndTimeRecord": "null",
			"oldChosen": "true",
			"newChosen": "false",
			"oldChosenTime": "2019-03-20 21:57:57",
			"newChosenTime": "null"
		}
		********************** Example **********************/
	}

	this.checkStartFromDB = async function (collegeId, siteId, order)/* fun15 */
	{
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: checkStartFromDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "checkStartFromDB");
		if (showDetails) console.log("[Start checkStartFromDB('" + siteId + "', '" + order + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT StartTimeRecord FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "checkStartFromDB('" + siteId + "', '" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.startTimeRecord = rows[0].StartTimeRecord;
			if (rows[0].StartTimeRecord == null) res.result = "false";
			else res.result = "true";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End checkStartFromDB('" + siteId + "', '" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkStartFromDB('1101', '2')",
			"legal": "true",
			"startTimeRecord": "2019-03-20 22:53:56",
			"result": "true"
		}
		********************** Example **********************/
	}

	this.checkEndFromDB = async function (collegeId, siteId, order)/* fun16 */
	{
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: checkEndFromDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "checkEndFromDB");
		if (showDetails) console.log("[Start checkEndFromDB('" + siteId + "', '" + order + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT EndTimeRecord FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "checkEndFromDB('" + siteId + "', '" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.endTimeRecord = rows[0].EndTimeRecord;
			if (rows[0].EndTimeRecord == null) res.result = "false";
			else res.result = "true";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End checkEndFromDB('" + siteId + "', '" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkEndFromDB('1101', '2')",
			"legal": "true",
			"endTimeRecord": "null",
			"result": "false"
		}
		********************** Example **********************/
	}

	this.checkTeacherSigninFromDB = async function (collegeId, siteId, order, id)/* fun17 */
	{
		// if this person hasn't been chosen, return true
		// VERY IMPORTANT: 
		// we suppose once a teacher has sign in this site in previous order,
		// he won't need to sign in again
		// (student won't sign in repeatedly)
		// <IMPORTANT>
		// [Xu] for the reasons above,
		// [Xu] I made an extra function(fun19) to check
		// [Xu] if one teacher has signed in the previous order.
		// [Xu] If one teacher has no need to sign in again, 
		// [Xu] I'll run an extra "teacherSigninToDB" function for him immediately
		// [Xu] just after receiving "true" from fun19
		// </IMPORTANT>
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: checkTeacherSigninFromDB("1101", "2", "11990005");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "checkTeacherSigninFromDB");
		if (showDetails) console.log("[Start checkTeacherSigninFromDB('" + siteId + "', '" + order + "', '" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT Signin FROM teacher_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and TeacherID = " + id + ";");
		let res = {};
		res.functionName = "checkTeacherSigninFromDB('" + siteId + "', '" + order + "', '" + id + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.signin = rows[0].Signin;
			if (rows[0].Signin == "0") res.result = "true";
			else res.result = "false";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End checkTeacherSigninFromDB('" + siteId + "', '" + order + "', '" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkTeacherSigninFromDB('1101', '2', '11990005')",
			"legal": "true",
			"signin": "true",
			"result": "false"
		}
		********************** Example **********************/
	}

	this.checkStudentSigninFromDB = async function (collegeId, siteId, order, id)/* fun18 */
	{
		// if this person hasn't been chosen, return true
		// VERY IMPORTANT: 
		// we suppose once a teacher has sign in this site in previous order,
		// he won't need to sign in again
		// (student won't sign in repeatedly)
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: checkStudentSigninFromDB("1101", "2", "11000001");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "checkStudentSigninFromDB");
		if (showDetails) console.log("[Start checkStudentSigninFromDB('" + siteId + "', '" + order + "', '" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT Signin FROM student_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and StudentID = " + id + ";");
		let res = {};
		res.functionName = "checkStudentSigninFromDB('" + siteId + "', '" + order + "', '" + id + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.signin = rows[0].Signin;
			if (rows[0].Signin == "0") res.result = "true";
			else res.result = "false";
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End checkStudentSigninFromDB('" + siteId + "', '" + order + "', '" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkStudentSigninFromDB('1101', '2', '11000001')",
			"legal": "true",
			"signin": "true",
			"result": "false"
		}
		********************** Example **********************/
	}

	this.checkTeacherSigninPreviousInterviewFromDB = async function(collegeId, siteId, order, id)/* fun19 */ /* VERY IMPORTANT */
	{
		// <IMPORTANT>
		// [Xu] if one teacher has signed in the previous interview,
		// [Xu] he has no need to sign in again (return true)
		// [Xu] I'll run an extra "teacherSigninToDB" function for him immediately
		// [Xu] just after receiving "true" from this function
		// </IMPORTANT>
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: checkTeacherSigninPreviousInterviewFromDB("1101", "2", "11990005");
		//if (showDetails) console.log("[Start checkTeacherSigninPreviousInterviewFromDB('" + siteId + "', '" + order + "', '" + id + "')]");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "checkTeacherSigninPreviousInterviewFromDB");
		let connection = await mysql.createConnection(myconnect);
		let previousOrder = ((+order) - 1) + "";
		let [rows, fields] = await connection.execute("SELECT Signin FROM teacher_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and TeacherID = " + id + ";");
		let res = {};
		res.functionName = "checkTeacherSigninPreviousInterviewFromDB('" + siteId + "', '" + order + "', '" + id + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			if (order == "1")
			{
				res.reason = "It's the first interview of that day.";
				res.result = "false";
			}
			else
			{
				let [rows, fields] = await connection.execute("SELECT Signin FROM teacher_takes where InterviewSiteID = " + siteId + " and OrderNumber = '" + previousOrder + "' and TeacherID = " + id + ";");
				if (!rows[0])
				{
					res.reason = "The teacher doesn't need to take the previous interview.";
					res.result = "false";
				}
				else
				{
					if (rows[0].Signin == "0")
					{
						res.reason = "The teacher needs to take the previous interview but he(she) doesn't.";
						res.result = "false";
					}
					else
					{
						res.reason = "The teacher has taken the previous interview.";
						res.done = "Now I've helped him(her) signing in this interview.";
						res.result = "true";
						await connection.execute("UPDATE teacher_takes SET Signin = 1 where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "' and TeacherID = " + id + ";");
					}
				}
			}
		}
		let content = JSON.stringify(res, null, '\t');
		//if (showJson) console.log(content);
		await connection.end();
		//if (showDetails) console.log("[End checkTeacherSigninPreviousInterviewFromDB('" + siteId + "', '" + order + "', '" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkTeacherSigninPreviousInterviewFromDB('1101', '2', '11990005')",
			"legal": "true",
			"reason": "The teacher needs to take the previous interview but he(she) doesn't.",
			"result": "false"
		}
		********************** Example **********************/
	}

	this.queryStudentFromDB = async function (collegeId, siteId, order)/* fun20 */
	{
		// return a list of student info consists of id, name, is_absent and img_url
		// [Xu] Exp: queryStudentFromDB("1101", "2");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "queryStudentFromDB");
		if (showDetails) console.log("[Start queryStudentFromDB('" + siteId + "', '" + order + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("select p.StudentID as id, p.StudentName as 'name', (1 - q.Signin) as is_absent, p.ImgURL as img_url from student as p, student_takes as q where p.StudentID = q.StudentID and q.InterviewSiteID = " + siteId + " and q.OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "queryStudentFromDB('" + siteId + "', '" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.info = rows;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End queryStudentFromDB('" + siteId + "', '" + order + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "queryStudentFromDB('1101', '2')",
			"legal": "true",
			"data": [
					{
							"id": 11000001,
							"name": "赵汐悦",
							"is_absent": "false",
							"img_url": "http://ILoveStudy.com/img/11/1.jpg"
					},
					{
							"id": 11000005,
							"name": "李昕睿",
							"is_absent": "false",
							"img_url": "http://ILoveStudy.com/img/11/1.jpg"
					},
					{
							"id": 11000009,
							"name": "张晨皓",
							"is_absent": "false",
							"img_url": "http://ILoveStudy.com/img/11/1.jpg"
					},
					{
							"id": 11000013,
							"name": "白读书",
							"is_absent": "false",
							"img_url": "http://ILoveStudy.com/img/11/1.jpg"
					},
					{
							"id": 11000017,
							"name": "陈一铭",
							"is_absent": "false",
							"img_url": "http://ILoveStudy.com/img/11/1.jpg"
					}
			]
		}
		********************** Example **********************/
	}

	this.getInterViewInfoFromDB = async function (collegeId, siteId, validateCode)/* fun21 */
	{
		// [Xu] Exp: getInterViewInfoFromDB("1102", "1102");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "getInterViewInfoFromDB");
		if (showDetails) console.log("[Start getInterViewInfoFromDB('" + siteId + "', '" + validateCode + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows0, fields0] = await connection.execute("SELECT Password FROM interviewsite where InterviewSiteID = " + siteId + ";");
		let res = {};
		res.functionName = "getInterViewInfoFromDB('" + siteId + "', '" + validateCode + "')";
		if (!rows0[0]) // if illegal
		{
			res.legal = "false";
			res.type = "interview_info";
			res.permission = "false";
		}
		else // if legal
		{
			res.legal = "true";
			res.type = "interview_info";
			if (rows0[0].Password != validateCode) res.permission = "false";
			else
			{
				res.permission = "true";
				res.info = {};
				let [rows1, fields1] = await connection.execute("SELECT CollegeID, CollegeName, InterviewSiteID, InterviewSite FROM interviewsite where InterviewSiteID = " + siteId + ";");
				res.info.college_id = rows1[0].CollegeID;
				res.info.college_name = rows1[0].CollegeName;
				res.info.site_id = rows1[0].InterviewSiteID;
				res.info.site_name = rows1[0].InterviewSite;
				res.info.periods = {};
				let [rows2, fields2] = await connection.execute("SELECT InterviewID as 'interviewID', OrderNumber as 'order', StartTime as 'start_time', EndTime as 'end_time', StartTimeRecord as 'start_time_record', EndTimeRecord as 'end_time_record' FROM interview where InterviewSiteID = " + siteId + " and StartTimeRecord is null;");
				
				for (let period in rows2)
				{
					//console.log(rows2[period]);
					let [rows3, fields3] = await connection.execute("SELECT b.TeacherID as 'id', b.TeacherName as 'name' FROM teacher_takes as a, teacher as b where a.TeacherID = b.TeacherID and a.InterviewSiteID = " + siteId + " and a.OrderNumber = '" + rows2[period].order + "';");
					rows2[period].teacher = rows3;
					for (let oneteacher in rows3)
					{
						let ask = await this.checkTeacherSigninPreviousInterviewFromDB(collegeId, siteId, rows2[period].order, rows3[oneteacher].id);
						let ask_j = JSON.parse(ask);
						//console.log(ask_j);
						rows3[oneteacher].signin_before = ask_j.result;
					}
					let [rows4, fields4] = await connection.execute("SELECT b.StudentID as 'id', b.StudentName as 'name' FROM student_takes as a, student as b where a.StudentID = b.StudentID and a.InterviewSiteID = " + siteId + " and a.OrderNumber = '" + rows2[period].order + "';");
					rows2[period].student = rows4;
				}
				res.info.periods = rows2;
				//{
				//	res.info.periods.push(rows1_item);
				//}
			}
		}
		let content = JSON.stringify(res, tracer_Date, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End getInterViewInfoFromDB('" + siteId + "', '" + validateCode + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "getInterViewInfoFromDB('1102', '1102')",
			"legal": "true",
			"type": "interview_info",
			"permission": "true",
			"info": {
					"college_id": 11,
					"college_name": "北京，可爱大学",
					"site_id": 1102,
					"site_name": "燕园楼816教室",
					"periods": [
							{
									"order": 1,
									"start_time": "2019-06-11 09:00:00",
									"end_time": "2019-06-11 09:50:00",
									"teacher": [
											{
													"id": 11990002,
													"name": "张建龙"
											},
											{
													"id": 11990006,
													"name": "陈鸿玉"
											},
											{
													"id": 11990010,
													"name": "林妍"
											}
									],
									"student": [
											{
													"id": 11000002,
													"name": "赵子曦"
											},
											{
													"id": 11000006,
													"name": "王靖雯"
											},
											{
													"id": 11000010,
													"name": "张梓恒"
											},
											{
													"id": 11000014,
													"name": "魏民谣"
											},
											{
													"id": 11000018,
													"name": "杨芊慧"
											}
									]
							},
							{
									"order": 2,
									"start_time": "2019-06-11 10:00:00",
									"end_time": "2019-06-11 10:50:00",
									"teacher": [
											{
													"id": 11990003,
													"name": "蔡文化"
											},
											{
													"id": 11990007,
													"name": "杨文锦"
											},
											{
													"id": 11990011,
													"name": "谢子琦"
											}
									],
									"student": [
											{
													"id": 11000003,
													"name": "李明泽"
											},
											{
													"id": 11000007,
													"name": "王琛杰"
											},
											{
													"id": 11000011,
													"name": "吴所谓"
											},
											{
													"id": 11000015,
													"name": "陈逸轩"
											},
											{
													"id": 11000019,
													"name": "杨宏亮"
											}
									]
							}
					]
			}
		}
		********************** Example **********************/
	}

	this.studentQueryOrderFromDB = async function (collegeId, siteId)/* fun22 */
	{
		// if currently a teacher in this site has chosen an order, return true info
		//return {
		//	"type": "site_info",
		//	"permission": "true",
		//	"info": {
		//		"order": "01"
		//	}
		// };
		// OR no teacher has chosen an order, return rejection
		// return {
		//	 "type": "site_info",
		//	 "permission": "false"
		/// };
		// [Xu] Exp: studentQueryOrderFromDB("1101");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "studentQueryOrderFromDB");
		let maxInterval = 180;
		let nowTime = new Date();
		let nowTime_seconds = nowTime.Format("hhmmss");
		let nowTime_js = nowTime.Format("yyyy-MM-dd hh:mm:ss");
		if (showDetails) console.log("[Start studentQueryOrderFromDB('" + siteId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows0, fields0] = await connection.execute("select InterviewID as 'interviewID', OrderNumber as 'order', ChosenTime as'chosen_time' from interview where Chosen = 1 and InterviewSiteID = " + siteId + " order by ChosenTime DESC;");
		let res = {};
		res.functionName = "studentQueryOrderFromDB('" + siteId + "')";
		if (!rows0[0]) // if illegal
		{
			res.legal = "false";
			res.type = "site_info";
			res.permission = "false";
		}
		else // if legal
		{
			res.legal = "true";
			res.type = "site_info";
			res.permission = "true";
			res.interviewID = rows0[0].interviewID;//update at 2019/5/21
			res.nowTime = nowTime_js;
			res.closestChosenTime = rows0[0].chosen_time;
			res.maxInterval_minute = maxInterval + "";
			let now_seconds = (+nowTime_seconds.substr(0, 2)) * 3600 + (+nowTime_seconds.substr(2, 2)) * 60 + (+nowTime_seconds.substr(4, 2));
			let closest_seconds = (+rows0[0].chosen_time.substr(11, 2)) * 3600 + (+rows0[0].chosen_time.substr(14, 2)) * 60 + (+rows0[0].chosen_time.substr(17, 2));
			let factInterval_minute = (now_seconds - closest_seconds) / 60.0;
			res.factInterval_minute = (factInterval_minute + "").substr(0,7);
			if (factInterval_minute <= maxInterval)
			{
				res.info = {};
				res.info.order = rows0[0].order;
				res.info.interviewID = rows0[0].interviewID;
				res.info.chosen_time = rows0[0].chosen_time;
			}
			else
			{
				res.permission = "false";
			}
		}
		let content = JSON.stringify(res, tracer_Date, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End studentQueryOrderFromDB('" + siteId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "studentQueryOrderFromDB('1101')",
			"legal": "true",
			"type": "site_info",
			"permission": "true",
			"nowTime": "2019-03-21 02:35:25",
			"closestChosenTime": "2019-03-21 02:33:40",
			"maxInterval_minute": "10",
			"factInterval_minute": "1.75",
			"info": {
					"order": "第2场",
					"interviewID": 770007
					"chosen_time": "2019-03-21 02:33:40"
			}
		}
		********************** Example **********************/
	}

	this.getImgURLFromDB = async function (collegeId, id)/* fun23 */
	{
		// [Xu] Exp: getImgURLFromDB("11000001");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "getImgURLFromDB");
		if (showDetails) console.log("[Start getImgURLFromDB('" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "getImgURLFromDB('" + id + "')]";
		let [rows, fields] = await connection.execute("SELECT s.ImgURL FROM student as s where s.StudentID = " + id + ";");
		if (!rows[0])
		{
			let [rows1, fields1] = await connection.execute("SELECT t.ImgURL FROM teacher as t where t.TeacherID = " + id + ";");
			if (!rows1[0])
			{
				res.legal = "false"; // if illegal
			}
			else
			{
				res.legal = "true";
				res.side = "teacher";
				res.result = rows1[0].ImgURL;
			}
		}
		else // if legal
		{
			res.legal = "true";
			res.side = "student";
			res.result = rows[0].ImgURL;
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End getImgURLFromDB('" + id + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "getImgURLFromDB('11990001')]",
			"legal": "true",
			"side": "teacher",
			"result": null
		}
		********************** Example **********************/
	}

	this.setImgURLToDB = async function (collegeId, id, url)/* fun24 */
	{
		// [Xu] Exp: setImgURLTomDB("11000001", "http://ILoveStudy.com/img/11/1.jpg");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "setImgURLToDB");
		if (showDetails) console.log("[Start setImgURLToDB('" + id + "', '" + url + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		let nowTime = new Date();
		let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
		res.functionName = "setImgURLToDB('" + id + "', '" + url + "')]";
		let [rows, fields] = await connection.execute("SELECT s.ImgURL FROM student as s where s.StudentID = " + id + ";");
		if (!rows[0])
		{
			let [rows1, fields1] = await connection.execute("SELECT t.ImgURL FROM teacher as t where t.TeacherID = " + id + ";");
			if (!rows1[0])
			{
				res.legal = "false"; // if illegal
			}
			else
			{
				res.legal = "true";
				res.side = "teacher";
				res.oldImgURL = rows1[0].ImgURL;
				res.newImgURL = url;
				await connection.execute("UPDATE teacher SET ImgURL = '" + url + "', UpdateTime = " + nowTime_db + " where TeacherID = " + id + ";");
			}
		}
		else // if legal
		{
			res.legal = "true";
			res.side = "student";
			res.oldImgURL = rows[0].ImgURL;
			res.newImgURL = url;
			await connection.execute("UPDATE student SET ImgURL = '" + url + "', UpdateTime = " + nowTime_db + " where StudentID = " + id + ";");
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End setImgURLToDB('" + id + "', '" + url + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "getImgURLFromDB('11990001')]",
			"legal": "true",
			"side": "teacher",
			"oldImgURL": null,
			"newImgURL": "http://ILoveStudy.com/img/11/1.jpg"
		}
		********************** Example **********************/
	}

	this.resetStudentImgURLToDB = async function (collegeId, id)/* fun25 */
	{
		// [Xu] Exp: resetImgURLTomDB("11000001", "http://ILoveStudy.com/img/11/1.jpg");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "resetStudentImgURLToDB");
		if (showDetails) console.log("[Start resetImgURLToDB('" + id + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		let defaultURL = "http://ILoveStudy.com/img/11/1.jpg";
		res.functionName = "resetImgURLToDB('" + id + "')]";
		let [rows, fields] = await connection.execute("SELECT s.ImgURL FROM student as s where s.StudentID = " + id + ";");
		if (!rows[0])
		{
			let [rows1, fields1] = await connection.execute("SELECT t.ImgURL FROM teacher as t where t.TeacherID = " + id + ";");
			if (!rows1[0])
			{
				res.legal = "false"; // if illegal
			}
			else
			{
				res.legal = "true";
				res.side = "teacher";
				res.oldImgURL = rows1[0].ImgURL;
				res.newImgURL = defaultURL;
				await connection.execute("UPDATE teacher SET ImgURL = '" + defaultURL + "' where TeacherID = " + id + ";");
			}
		}
		else // if legal
		{
			res.legal = "true";
			res.side = "student";
			res.oldImgURL = rows[0].ImgURL;
			res.newImgURL = defaultURL;
			await connection.execute("UPDATE student SET ImgURL = '" + defaultURL + "' where StudentID = " + id + ";");
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End resetImgURLToDB('" + id + "')]");
		return content;
		/********************** Example **********************
		{
			"functionName": "resetImgURLToDB('11000001')]",
			"legal": "true",
			"side": "student",
			"oldImgURL": "http://ILoveStudy.com/img/11/1.jpg",
			"newImgURL": "http://ILoveStudy.com/img/11/1.jpg"
		}
		********************** Example **********************/
	}

	this.cleanDataToDB = async function (collegeId)/* fun26 */
	{
		// [Xu] Exp: cleanDataToDB();
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "cleanDataToDB");
		if (showDetails) console.log("[Start cleanDataToDB()");
		let connection = await mysql.createConnection(myconnect);
		await connection.execute("update interviewsite set TeacherSideChosen = 0, StudentSideChosen = 0;");
		await connection.execute("update interview set Chosen = 0, ChosenTime = null;");
		//await connection.execute("update interview set BlockString = null, VideoPathString = null;");
		//await connection.execute("update interview set StartTimeRecord = null, EndTimeRecord = null;");
		await connection.execute("update teacher_takes set signin = 0;");
		await connection.execute("update student_takes set signin = 0;");
		//await connection.execute("update teacher set ImgURL = null, UpdateTime = null;");
		//await connection.execute("update student set ImgURL = null, UpdateTime = null;");
		let res = {};
		res.functionName = "cleanData()";
		res.legal = "true";
		res.result = "true";
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End cleanDataToDB()");
		return content;
		/********************** Example **********************
		{
			"functionName": "cleanDataToDB()",
			"legal": "true",
			"result": "true"
		}
		********************** Example **********************/
	}

	this.newSchemaToDB = async function(collegeId)/* fun27 */
	{
		// [Xu] Exp: newSchemaToDB("66");
		let connection;
		if (showDetails) console.log("[Start newSchemaToDB('" + collegeId + "')]");
		let res = {};
		res.functionName = "newSchemaToDB('" + collegeId + "')";
		if (+collegeId < 0 || +collegeId > 99)
		{
			res.legal = "false";
			res.reason = "The collegeId is illegal.";
		}
		else // if legal
		{
			res.legal = "true";
			myconnect.database = "sunshine";
			connection = await mysql.createConnection(myconnect);
			let check = await this.checkSchemaFromDB(collegeId);
			check = JSON.parse(check);
			//console.log(check);
			if (check.result == "true")
			{
				res.oldExist = "true";
				await this.dropSchemaToDB(collegeId);
			}
			else 
			if (true) res.oldExist = "false";
			{
				//console.log("ssssssssssssssssssssssssssssssssss");
				await connection.execute("create schema sunshine_" + collegeId + ";");
				await connection.end();
				myconnect.database = "sunshine_" + collegeId;
				connection = await mysql.createConnection(myconnect);
				
				//interview表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`interview` (" +
					"`InterviewID` int(10) unsigned NOT NULL AUTO_INCREMENT," +
					"`InterviewSiteID` int(10) unsigned DEFAULT NULL," +
					"`OrderNumber` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`StartTime` datetime NOT NULL," +
					"`EndTime` datetime NOT NULL," +
					"`StartTimeRecord` datetime DEFAULT NULL," +
					"`EndTimeRecord` datetime DEFAULT NULL," +
					"`Chosen` int(11) DEFAULT 0," +
					"`ChosenTime` datetime DEFAULT NULL," +
					"`BlockString` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`VideoPathString` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"PRIMARY KEY (`InterviewID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
					
				//interviewsite表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`interviewsite` (" +
					"`InterviewSiteID` int(10) unsigned NOT NULL AUTO_INCREMENT," +
					"`CollegeID` int(10) unsigned DEFAULT NULL," +
					"`CollegeName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`InterviewSite` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL," +
					"`Password` varchar(45) DEFAULT NULL," +
					//"`RegisterID` int(10) unsigned DEFAULT NULL," +
					//"`RegisterName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`TeacherSideChosen` int(11) DEFAULT 0," +
					"`StudentSideChosen` int(11) DEFAULT 0," +
					"PRIMARY KEY (`InterviewSiteID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8;");
					
				//student表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`student` (" +
					"`StudentID` int(10) unsigned NOT NULL," +
					"`CollegeID` int(10) unsigned," +
					"`StudentName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL," +
					"`PhoneNumber` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`Email` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`ImgURL` varchar(45) COLLATE utf8_unicode_ci DEFAULT 'http://www.ilovestudy.com/img/11990001.jpg'," +
					"`UpdateTime` datetime DEFAULT NULL," +
					"PRIMARY KEY (`StudentID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
				
				//teacher表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`teacher` (" +
					"`TeacherID` int(10) unsigned NOT NULL," +
					 "`CollegeID` int(10) unsigned," +
					"`TeacherName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL," +
					"`DeptName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`PhoneNumber` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`Email` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`ImgURL` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`UpdateTime` datetime DEFAULT NULL," +
					"PRIMARY KEY (`TeacherID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
				
				//student_takes表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`student_takes` (" +
					"`InterviewID` int(10) unsigned NOT NULL," +
					"`StudentID` int(10) unsigned NOT NULL," +
					"`InterviewSiteID` int(10) unsigned NOT NULL," +
					"`OrderNumber` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`Signin` int(11) NOT NULL," +
					"`VideoPath` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`VideoDuration` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL," +
					"PRIMARY KEY (`InterviewID`,`StudentID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
				
				//teacher_takes表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`teacher_takes` (" +
					"`InterviewID` int(10) unsigned NOT NULL," +
					"`TeacherID` int(10) unsigned NOT NULL," +
					"`InterviewSiteID` int(10) unsigned NOT NULL," +
					"`OrderNumber` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`Signin` int(11) NOT NULL," +
					"PRIMARY KEY (`InterviewID`,`TeacherID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
				
				//xls_student_takes表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`xls_student_takes` (" +
					"`InterviewSiteName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL," +
					"`StartTime` datetime NOT NULL," +
					"`EndTime` datetime NOT NULL," +
					"`StudentID` int(11) NOT NULL," +
					"`StudentName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`Email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL," +
					"`PhoneNumber` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL," +
					"`CollegeID` int(11) DEFAULT NULL," +
					"`ImgURL` varchar(45) COLLATE utf8_bin DEFAULT NULL," +
					"`UpdateTime` datetime DEFAULT NULL," +
					"`CollegeName` varchar(45) DEFAULT NULL," +
					"`Password` varchar(45) DEFAULT NULL," +
					"`StudentSideChosen` int(11) DEFAULT 0," +
					"`TeacherSideChosen` int(11) DEFAULT 0," +
					"PRIMARY KEY (`InterviewSiteName`,`StudentID`,`StartTime`,`EndTime`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;");
					
				//xls_teacher_takes表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`xls_teacher_takes` (" +
					"`InterviewSiteName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL," +
					"`StartTime` datetime NOT NULL," +
					"`EndTime` datetime NOT NULL," +
					"`TeacherID` int(11) NOT NULL," +
					"`TeacherName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`Email` varchar(45) COLLATE utf8_bin DEFAULT NULL," +
					"`PhoneNumber` varchar(45) COLLATE utf8_bin DEFAULT NULL," +
					"`DeptName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`CollegeID` int(11) DEFAULT NULL," +
					"`ImgURL` varchar(45) COLLATE utf8_bin DEFAULT NULL," +
					"`UpdateTime` datetime DEFAULT NULL," +
					"PRIMARY KEY (`InterviewSiteName`,`TeacherID`,`StartTime`,`EndTime`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;");
					
				//info表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`info` (" +
					"`CollegeID` int(11) NOT NULL," +
					"`CollegeName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL," +
					"`InterviewName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '博雅'," +
					"`CreateTime` datetime DEFAULT NULL," +
					"`LogCount` int(11) DEFAULT 0," +
					"PRIMARY KEY (`CollegeID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;");
				
				//log_data表
				await connection.execute("CREATE TABLE sunshine_" + collegeId + ".`logdata` (" +
					"`LogID` int(11) NOT NULL AUTO_INCREMENT," +
					"`LogTime` datetime DEFAULT NULL," +
					"`FunctionName` varchar(45) COLLATE utf8_bin DEFAULT NULL," +
					"`IP` varchar(45) COLLATE utf8_bin DEFAULT NULL," +
					"PRIMARY KEY (`LogID`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;"); 
				let nowTime = new Date();
				let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
				await connection.execute("INSERT INTO sunshine_" + collegeId + ".`info`(CollegeID, CollegeName, CreateTime, LogCount) " +
					"VALUES (" + collegeId + ", (select CollegeName from collegenames.namedata where CollegeID = " + collegeId + "), " + nowTime_db + ", 0);");
				//await connection.execute("ALTER TABLE sunshine_" + collegeId + ".student AUTO_INCREMENT = " + ((+collegeId) * 1000000) + ";");
				//await connection.execute("ALTER TABLE sunshine_" + collegeId + ".teacher AUTO_INCREMENT = " + ((+collegeId) * 1000000 + 990000) + ";");
				await connection.execute("ALTER TABLE sunshine_" + collegeId + ".interviewSite AUTO_INCREMENT = " + ((+collegeId) * 100) + ";");
				await connection.execute("ALTER TABLE sunshine_" + collegeId + ".interview AUTO_INCREMENT = " + ((+collegeId) * 10000) + ";");
			}
		}
		
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End newSchemaToDB('" + collegeId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "newSchemaToDB('66')",
			"legal": "true"
		}
		********************** Example **********************/
	}

	this.dropSchemaToDB = async function(collegeId)/* fun28 */
	{
		// [Xu] Exp: dropSchemaToDB("66");
		myconnect.database = "sunshine_" + collegeId;
		//await this.logUpdateToDB(collegeId, "dropSchemaToDB");
		if (showDetails) console.log("[Start dropSchemaToDB('" + collegeId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "dropSchemaToDB('" + collegeId + "')";
		if (+collegeId < 0 || +collegeId > 99)
		{
			res.legal = "false";
			res.reason = "The collegeId is illegal.";
		}
		else // if legal
		{
			res.legal = "true";
			//先清空对应certification中内容20190428
			let [rows, fields] = await connection.execute("select distinct StudentName, StudentID from student;");
			for (let i in rows)
			{
				await connection.execute("delete from certification.userinfo where StudentName = '" + rows[i].StudentName + "' and StudentID = " + rows[i].StudentID + ";");
			}
			//先清空对应certification中内容20190428
			await connection.execute("drop schema sunshine_" + collegeId + ";");
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End dropSchemaToDB('" + collegeId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "dropSchemaToDB('66')",
			"legal": "true"
		}
		********************** Example **********************/
	}

	this.insertStudentTakesToDB = async function(collegeId, interviewSiteName, startTime, endTime, studentID, studentName, email, phoneNumber)/* fun29 */
	{
		// [Xu] Exp: insertStudentTakesToDB("66", "燕园楼816教室", "2019/6/11 9:00", "2019/6/11 9:50", "11000002", "赵子曦", "2424046755@qq.cn", "18892748534");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "insertStudentTakesToDB");
		if (showDetails) console.log("[Start insertStudentTakesToDB('" + collegeId + "', '" + interviewSiteName + "', '" + startTime + "', '" + endTime + 
			"', '" + studentID + "', '" + studentName + "', '" + email + "', '" + phoneNumber + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "insertStudentTakesToDB('" + interviewSiteName + "', '" + startTime + "', '" + endTime + "', '" + studentID + "', '" + studentName + "', '" + email + "', '" + phoneNumber + "')";
		res.legal = "true";
		await connection.execute("insert into xls_student_takes(InterviewSiteName, StartTime, EndTime, StudentID, StudentName, Email, PhoneNumber) " + 
			"values('" + interviewSiteName + "', '" + startTime + "', '" + endTime + "', " + studentID + ", '" + studentName + "', '" + email + "', '" + phoneNumber + "');");
		await connection.execute("update xls_student_takes set CollegeID = " + collegeId + ";");
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End insertStudentTakesToDB('" + collegeId + "', '" + interviewSiteName + "', '" + startTime + "', '" + endTime + 
			"', '" + studentID + "', '" + studentName + "', '" + email + "', '" + phoneNumber + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "insertStudentTakesToDB('燕园楼816教室', '2019/6/11 9:00', '2019/6/11 9:50', '11000002', '赵子曦', '2424046755@qq.cn', '18892748534')",
			"legal": "true"
		}
		********************** Example **********************/
	}

	this.insertTeacherTakesToDB = async function(collegeId, interviewSiteName, startTime, endTime, teacherID, teacherName, email, phoneNumber, deptName)/* fun30 */
	{
		// [Xu] Exp: insertTeacherTakesToDB("66", "燕园楼816教室", "2019/6/11 9:00", "2019/6/11 9:50", "11990002", "张建龙", "1008066205@zz.edu.cn", "13346669064", "化学");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "insertTeacherTakesToDB");
		if (showDetails) console.log("[Start insertTeacherTakesToDB('" + collegeId + "', '" + interviewSiteName + "', '" + startTime + "', '" + endTime + 
			"', '" + teacherID + "', '" + teacherName + "', '" + email + "', '" + phoneNumber + "', '" + deptName + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "insertTeacherTakesToDB('" + interviewSiteName + "', '" + startTime + "', '" + endTime + "', '" + teacherID + "', '" + teacherName + "', '" + email + "', '" + phoneNumber + "', '" + deptName + "')";
		res.legal = "true";
		await connection.execute("insert into xls_teacher_takes(InterviewSiteName, StartTime, EndTime, TeacherID, TeacherName, Email, PhoneNumber, DeptName) " + 
			"values('" + interviewSiteName + "', '" + startTime + "', '" + endTime + "', " + teacherID + ", '" + teacherName + "', '" + email + "', '" + phoneNumber + "', '" + deptName + "');");
		await connection.execute("update xls_teacher_takes set CollegeID = " + collegeId + ";");
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End insertTeacherTakesToDB('" + collegeId + "', '" + interviewSiteName + "', '" + startTime + "', '" + endTime + 
			"', '" + teacherID + "', '" + teacherName + "', '" + email + "', '" + phoneNumber + "', '" + deptName + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "insertTeacherTakesToDB('燕园楼816教室', '2019/6/11 9:00', '2019/6/11 9:50', '11990002', '张建龙', '1008066205@zz.edu.cn', '13346669064', '化学')",
			"legal": "true"
		}
		********************** Example **********************/
	}

	this.buildTablesToDB = async function(collegeId)/* fun31 */
	{
		// [Xu] Exp: buildTablesToDB("66");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "buildTablesToDB");
		if (showDetails) console.log("[Start buildTablesToDB('" + collegeId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "buildTablesToDB('" + collegeId + "')";
		res.legal = "true";
		await connection.execute("insert into student select distinct StudentID, CollegeID, StudentName, PhoneNumber, Email, ImgURL, UpdateTime " +
			"from xls_student_takes order by StudentID;");
		res.build_student = "success";//建立student成功
		await connection.execute("insert into teacher select distinct TeacherID, CollegeID, TeacherName, Deptname, PhoneNumber, Email, ImgURL, UpdateTime " + 
			"from xls_teacher_takes order by TeacherID;");
		res.build_teacher = "success";//建立teacher成功
		await connection.execute("insert into interviewsite select distinct null, CollegeID, CollegeName, InterviewSiteName, `Password`, TeacherSideChosen, StudentSideChosen " + 
			"from xls_student_takes order by InterviewSiteName;");
		await connection.execute("update interviewsite set `Password` = ceiling(rand() * 9000 + 999);");
		await connection.execute("update interviewsite set `CollegeName` = (select CollegeName from collegenames.namedata where CollegeID = " + collegeId + ");");
		res.build_interviewSite = "success";//建立interviewSite成功
		await connection.execute("insert into interview select distinct null,q.InterviewSiteID,null," + 
			"StartTime,EndTime,null,null,0,null,null,null from xls_student_takes as p, interviewsite as q where q.InterviewSite = p.InterviewSiteName order by q.InterviewSiteID, StartTime;");
		if (true)
		{
			let [rows, fields] = await connection.execute("SELECT * from interview;");
			//console.log(rows);
			if (!rows[0]);//if empty
			else
			{
				let tmpDate = rows[0].StartTime.substr(0, 10);
				let tmpSiteID = rows[0].InterviewSiteID;
				let count = 0;
				for (let oneInterview in rows)
				{
					count++;
					if (oneInterview != 0)
					{
						newDate = rows[oneInterview].StartTime.substr(0, 10);
						newSiteID = rows[oneInterview].InterviewSiteID;
						if (newDate != tmpDate || newSiteID != tmpSiteID)
						{
							count = 1;
							tmpDate = newDate;
							tmpSiteID = newSiteID;
						}
					}
					let orderString = "第" + count + "场";
					//console.log(orderString);
					await connection.execute("update interview set OrderNumber = '" + orderString + "' where InterviewID = " + rows[oneInterview].InterviewID + ";");
				}
			}
		}
		res.build_interview = "success";//建立interview成功
		await connection.execute("insert into student_takes select distinct q.InterviewID, p.StudentID, q.InterviewSiteID, q.OrderNumber, 0 as Signin, null, null " + 
			"from xls_student_takes as p, " + 
			"interview as q, interviewsite as r where p.InterviewSiteName = r.InterviewSite and q.StartTime = p.StartTime and q.EndTime = p.EndTime and r.InterviewSiteID = " + 
			"q.InterviewSiteID order by q.InterviewID, p.StudentID;");
		res.build_student_takes = "success";//建立student_takes成功
		await connection.execute("insert into certification.userinfo " + 
			"select distinct null, a.StudentID, StudentName, c.CollegeID, c.CollegeName, a.InterviewID, e.InterviewSite, d.StartTime, d.EndTime, d.StartTimeRecord, d.EndTimeRecord, null, null " +
			"from student_takes as a, student as b, info as c, interview as d, interviewsite as e " +
			"where a.StudentID = b.StudentID and d.InterviewID = a.InterviewID and d.InterviewSiteID = e.InterviewSiteID;");
			//建立学生certification初表
		await connection.execute("insert into teacher_takes select distinct q.InterviewID, p.TeacherID, q.InterviewSiteID, q.OrderNumber, 0 as Signin from xls_teacher_takes as p, " + 
			"interview as q, interviewsite as r where p.InterviewSiteName = r.InterviewSite and q.StartTime = p.StartTime and q.EndTime = p.EndTime and r.InterviewSiteID = " + 
			"q.InterviewSiteID order by q.InterviewID, p.TeacherID;");
		res.build_teacher_takes = "success";//建立teacher_takes成功
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End buildTablesToDB('" + collegeId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "buildTablesToDB('66')",
			"legal": "true",
			"build_student": "success",
			"build_teacher": "success",
			"build_interviewSite": "success",
			"build_interview": "success",
			"build_student_takes": "success",
			"build_teacher_takes": "success"
		}
		********************** Example **********************/
	}

	this.webNewAccountToDB = async function(userName, userPassword, userType, collegeId, remarks)/* fun32 */
	{
		// [Xu] Exp: webNewAccountToDB("xuenze", "xuenze", "addInformation", "66", "徐sir真帅");
		myconnect.database = "webaccount";
		if (showDetails) console.log("[Start webNewAccountToDB('" + userName + "', '" + userPassword + "', '" + userType + "', '" + collegeId + "', '" + remarks + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "webNewAccountToDB('" + userName + "', '" + userPassword + "', '" + userType + "', '" + collegeId + "', '" + remarks + "')";
		
		let [rows, fields] = await connection.execute("SELECT UserName from userinfo where UserName = '" + userName + "';");
		if (!rows[0])//if legal
		{
			res.legal = "true";
			let nowTime = new Date();
			let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
			let nowTime_js = nowTime.Format("yyyy-MM-dd hh:mm:ss");
			await connection.execute("insert into webaccount.userinfo(UserID, UserName, UserPassword, UserType, CollegeID, Remarks, CreateTime) " + 
				"values(null,'" + userName + "', '" + userPassword + "', '" + userType + "', '" + collegeId + "', '" + remarks + "', " + nowTime_db + ");");
			let [rows2, fields2] = await connection.execute("SELECT UserID from userinfo where UserName = '" + userName + "';");
			res.info = {};
			res.info.UserID = rows2[0].UserID;
			res.info.UserName = userName;
			res.info.UserPassword = userPassword;
			res.info.UserType = userType;
			res.info.CollegeID = collegeId;
			res.info.Remarks = remarks;
			res.info.CreateTime = nowTime_js;
		}
		else
		{
			res.legal = "false";
			res.reason = "This UserName exists.";
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End webNewAccountToDB('" + userName + "', '" + userPassword + "', '" + userType + "', '" + collegeId + "', '" + remarks + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "webNewAccountToDB('xiangdongwei', 'xiangdongwei', 'addInformation', '88', '向Sir真帅')",
			"legal": "true"
		}
		********************** Example **********************/
	}

	this.webDeleteAccountToDB = async function(userName)/* fun33 */
	{
		// [Xu] Exp: webDeleteAccountToDB("xuenze");
		myconnect.database = "webaccount";
		if (showDetails) console.log("[Start webDeleteAccountToDB('" + userName + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "webDeleteAccountToDB('" + userName + "')";
		
		let [rows, fields] = await connection.execute("SELECT * from userinfo where UserName = '" + userName + "';");
		if (!rows[0])//if illegal
		{
			res.legal = "false";
			res.reason = "This UserName doesn't exist.";
		}
		else
		{
			res.legal = "true";
			//console.log(rows[0]);
			res.info = {};
			res.info.UserID = rows[0].UserID;
			res.info.UserName = rows[0].UserName;
			res.info.UserPassword = rows[0].UserPassword;
			res.info.CollegeID = rows[0].CollegeID;
			res.info.Remarks = rows[0].Remarks;
			res.info.CreateTime = rows[0].CreateTime;
			await connection.execute("delete from userinfo where UserName = '" +  userName+ "';");
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End webDeleteAccountToDB('" + userName + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "webDeleteAccountToDB('xiangsir')",
			"legal": "true",
			"info": {
					"UserID": 4,
					"UserName": "xiangsir",
					"UserPassword": "xiangsir",
					"CollegeID": 66,
					"Remarks": "xiangsir真帅",
					"CreateTime": "2019-04-19 20:25:54"
			}
		}
		********************** Example **********************/
	}
	
	this.webValidateInformationFromDB = async function(userName, userPassword)/* fun34 */
	{
		// [Xu] Exp: webValidateInformationFromDB("xuenze", "xuenze");
		myconnect.database = "webaccount";
		if (showDetails) console.log("[Start webValidateInformationFromDB('" + userName + "', '" + userPassword + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "webValidateInformationFromDB('" + userName + "', '" + userPassword + "')";
		let [rows, fields] = await connection.execute("SELECT UserPassword, UserType, CollegeID from userinfo where UserName = '" + userName + "' and UserType = 'information';");
		if (!rows[0])//if illegal
		{
			res.legal = "false";
			res.reason = "This userName doesn't exist.";
			res.result = "false";
		}
		else
		{
			res.legal = "true";//if legal
			res.UserType = rows[0].UserType;
			res.CollegeID = rows[0].CollegeID;
			if (userPassword != rows[0].UserPassword)
			{
				res.reason = "Wrong Password.";
				res.result = "false";
			}
			else res.result = "true";
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End webValidateInformationFromDB('" + userName + "', '" + userPassword + "')]\n");
		return content;
		/********************** Example **********************
		{
			 "functionName": "webValidateInformationFromDB('xuenze', 'xuenze')",
			"legal": "true",
			"UserType": "addInformation",
			"CollegeID": 66,
			"result": "true"
		}
		********************** Example **********************/
	}
	
	this.webGetSiteTableFromDB = async function(collegeId)/* fun35 */
	{
		// [Xu] Exp: webGetSiteTableFromDB("66");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "webGetSiteTableFromDB");
		if (showDetails) console.log("[Start webGetSiteTableFromDB('" + collegeId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "webGetSiteTableFromDB('" + collegeId + "')";
		let [rows, fields] = await connection.execute("select InterviewSiteID, InterviewSite as InterviewSiteName, `Password` from interviewsite order by InterviewSiteID;");
		if (!rows[0])
		{
			res.legal = "false";
			res.reason = "Table sunshine_" + collegeId + ".interviewsite is empty.";
		}
		else
		{
			res.legal = "true";
			res.info = {};
			res.info = rows;
			
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End webGetSiteTableFromDB('" + collegeId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "webGetSiteTableFromDB('66')",
			"legal": "true",
			"info": [
					{
							"InterviewSiteID": 6600,
							"InterviewSiteName": "燕园楼816教室",
							"Password": "4742"
					},
					{
							"InterviewSiteID": 6601,
							"InterviewSiteName": "第九教学楼305教室",
							"Password": "7621"
					}
			]
		}
		********************** Example **********************/
	}
	
	this.checkSchemaFromDB = async function(collegeId)/* fun36 */
	{
		// [Xu] Exp: checkSchemaFromDB("66");
		myconnect.database = "sunshine";
		//if (showDetails) console.log("[Start checkSchemaFromDB('" + collegeId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "checkSchemaFromDB('" + collegeId + "')";
		let [rows, fields] = await connection.execute("SELECT count(0) as result FROM information_schema.TABLES WHERE table_schema = 'sunshine_" + collegeId + "';");
		res.legal = "true";
		if (rows[0].result != 0)
		{
			res.result = "true";
			res.tableCount = rows[0].result;
			//await logUpdateToDB(collegeId, "checkSchemaFromDB");
		}
		else res.result = "false";
		let content = JSON.stringify(res, null, '\t');
		//if (showJson) console.log(content);
		await connection.end();
		//if (showDetails) console.log("[End checkSchemaFromDB('" + collegeId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "checkSchemaFromDB('66')",
			"legal": true,
			"result": true,
			"tableCount": 10
		}
		********************** Example **********************/
	}

	this.webValidateVideoFromDB = async function (userName, userPassword)/* fun37 */
	{
		// [Xu] Exp: webValidateVideoFromDB("xuenze", "xuenze");
		myconnect.database = "webaccount";
		if (showDetails) console.log("[Start webValidateVideoFromDB('" + userName + "', '" + userPassword + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "webValidateVideoFromDB('" + userName + "', '" + userPassword + "')";
		let [rows, fields] = await connection.execute("SELECT UserPassword, UserType, CollegeID from userinfo where UserName = '" + userName + "' and UserType = 'video';");
		if (!rows[0])//if illegal
		{
			res.legal = "false";
			res.reason = "This userName doesn't exist.";
			res.result = "false";
		}
		else
		{
			res.legal = "true";//if legal
			res.UserType = rows[0].UserType;
			res.CollegeID = rows[0].CollegeID;
			if (userPassword != rows[0].UserPassword)
			{
				res.reason = "Wrong Password.";
				res.result = "false";
			}
			else res.result = "true";
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End webValidateVideoFromDB('" + userName + "', '" + userPassword + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "webValidateVideoFromDB('xuenze', 'xuenze')",
			"legal": "true",
			"UserType": "Video",
			"CollegeID": 66,
			"result": "true"
		}
		********************** Example **********************/
	}

	this.webValidateCertificationFromDB = async function (studentID, studentName)/* fun38 */
	{
		// [Xu] Exp: webValidateCertificationFromDB("11000013", "白读书");
		myconnect.database = "certification";
		if (showDetails) console.log("[Start webValidateCertificationFromDB('" + studentID + "', '" + studentName + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "webValidateCertificationFromDB('" + studentID + "', '" + studentName + "')";
		if (!studentName || studentName == "")
		{
			let [rows, fields] = await connection.execute("SELECT * from userinfo where StudentID = " + studentID + ";");
			//console.log(rows);
			if (!rows[0])//if not exists such account
			{
				res.legal = "false";
				res.default = "doesn't use studentName";
				res.reason = "This studentName doesn't exist.";
				res.result = "false";
			}
			else
			{
				res.legal = "true";//if legal
				for (let i in rows)
				{
					let [rows1, fields1] = await connection.execute("SELECT InterviewName from collegenames.namedata where CollegeID = " + rows[i].CollegeID + ";");
					rows[i].InterviewName = rows1[0].InterviewName;
				}
				res.default = "doesn't use studentName";
				res.studentID = studentID;
				res.studentName = rows[0].StudentName;
				res.count = rows.length;
				res.collegeName = rows[0].CollegeName;
				res.collegeID = rows[0].CollegeID;
				res.interviewName = rows[0].InterviewName;
				res.interviewID = rows[0].InterviewID;
				res.interviewSiteName = rows[0].InterviewSiteName;
				res.startTime = rows[0].StartTime;
				res.endTime = rows[0].EndTime;
				res.startTimeRecord = rows[0].StartTimeRecord;
				res.endTimeRecord = rows[0].EndTimeRecord;
				res.blockString = rows[0].BlockString;
				res.videoPathString = rows[0].VideoPathString;
				let [rows2, fields2] = await connection.execute("select p.StudentID, q.StudentName from sunshine_" + res.collegeID + ".student_takes as p," +
					"sunshine_" + res.collegeID + ".student as q where p.InterviewID = " + res.interviewID + " and p.StudentID = q.StudentID; ;");
				let [rows3, fields3] = await connection.execute("select p.TeacherID, q.TeacherName from sunshine_" + res.collegeID + ".teacher_takes as p," +
					"sunshine_" + res.collegeID + ".teacher as q where p.InterviewID = " + res.interviewID + " and p.TeacherID = q.TeacherID; ;");
				res.studentinfo = rows2;
				res.teacherinfo = rows3;
				res.result = "true";
			}
		}
		else
		{
			let [rows, fields] = await connection.execute("SELECT * from userinfo where StudentID = " + studentID + " and StudentName = '" + studentName + "';");
			if (!rows[0])//if not exists such account
			{
				res.legal = "false";
				res.default = "use studentName";
				res.reason = "This studentID with studentName doesn't exist.";
				res.result = "false";
			}
			else
			{
				res.legal = "true";//if legal
				for (let i in rows)
				{
					let [rows1, fields1] = await connection.execute("SELECT InterviewName from collegenames.namedata where CollegeID = " + rows[i].CollegeID + ";");
					rows[i].InterviewName = rows1[0].InterviewName;
				}
				res.default = "use studentName";
				res.studentID = studentID;
				res.studentName = rows[0].StudentName;
				res.count = rows.length;
				res.collegeName = rows[0].CollegeName;
				res.collegeID = rows[0].CollegeID;
				res.interviewName = rows[0].InterviewName;
				res.interviewID = rows[0].InterviewID;
				res.interviewSiteName = rows[0].InterviewSiteName;
				res.startTime = rows[0].StartTime;
				res.endTime = rows[0].EndTime;
				res.startTimeRecord = rows[0].StartTimeRecord;
				res.endTimeRecord = rows[0].EndTimeRecord;
				res.blockString = rows[0].BlockString;
				res.videoPathString = rows[0].VideoPathString;
				let [rows2, fields2] = await connection.execute("select p.StudentID, q.StudentName from sunshine_" + res.collegeID + ".student_takes as p," +
					"sunshine_" + res.collegeID + ".student as q where p.InterviewID = " + res.interviewID + " and p.StudentID = q.StudentID; ;");
				let [rows3, fields3] = await connection.execute("select p.TeacherID, q.TeacherName from sunshine_" + res.collegeID + ".teacher_takes as p," +
					"sunshine_" + res.collegeID + ".teacher as q where p.InterviewID = " + res.interviewID + " and p.TeacherID = q.TeacherID; ;");
				res.studentinfo = rows2;
				res.teacherinfo = rows3;
				res.result = "true";
			}
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End webValidateCertificationFromDB('" + studentID + "', '" + studentName + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "webValidateCertificationFromDB('11000013', '白读书')",
			"legal": "true",
			"default": "use studentName",
			"studentID": "11000013",
			"studentName": "白读书",
			"count": 1,
			"collegeName": "解放隔壁长度测试可能很长大学",
			"collegeID": "77",
			"interviewName": "2077年P大博雅考试",
			"interviewID": 770007,
			"interviewSiteName": "第九教学楼305教室",
			"startTime": "2019-06-11 10:00:00",
			"endTime": "2019-06-11 10:50:00",
			"startTimeRecord": "2019-04-28 16:42:05",
			"endTimeRecord": "2019-04-28 16:42:05",
			"blockString": "Block: xiangsirzhenshuai",
			"videoPathString": "VideoPath: xiangsirzhenshuai",
			"studentinfo": [
					{
							"StudentID": 11000001,
							"StudentName": "赵汐悦"
					},
					{
							"StudentID": 11000005,
							"StudentName": "李昕睿"
					},
					{
							"StudentID": 11000009,
							"StudentName": "张晨皓"
					},
					{
							"StudentID": 11000013,
							"StudentName": "白读书"
					},
					{
							"StudentID": 11000017,
							"StudentName": "陈一铭"
					}
			],
			"teacherinfo": [
					{
							"TeacherID": 11990001,
							"TeacherName": "赵一凡"
					},
					{
							"TeacherID": 11990005,
							"TeacherName": "贾紫"
					},
					{
							"TeacherID": 11990009,
							"TeacherName": "黄罡"
					}
			],
			"result": "true"
		}
		********************** Example **********************/
	}

	this.getBlockStringFromDB = async function (collegeId, interviewId)/* fun39 */
	{
		// [Xu] Exp: getBlockStringFromDB("66", "660000");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "getBlockStringFromDB");
		if (showDetails) console.log("[Start getBlockStringFromDB('" + collegeId + "', '" + interviewId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "getBlockStringFromDB('" + collegeId + "', '" + interviewId + "')";
		let [rows, fields] = await connection.execute("SELECT BlockString FROM interview where InterviewID = " + interviewId + ";");
		if (!rows[0])
		{
			res.legal = "false";
			res.reason = "This interviewID does't exist.";
			res.result = "???";
		}
		else // if legal
		{
			res.legal = "true";
			res.result = rows[0].BlockString;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End getBlockStringFromDB('" + collegeId + "', '" + interviewId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "getBlockStringFromDB('66', '660000')]",
			"legal": "true",
			"result": "null"
		}
		********************** Example **********************/
	}

	this.setBlockStringToDB = async function (collegeId, interviewId, blockString)/* fun40 */
	{
		// [Xu] Exp: setBlockStringToDB("66", "660000", "Block: xiangsirzhenshuai");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "setBlockStringToDB");
		if (showDetails) console.log("[Start setBlockStringToDB('" + collegeId + "', '" + interviewId + "', '" + blockString + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "setBlockStringToDB('" + collegeId + "', '" + interviewId + "', '" + blockString + "')";
		let [rows, fields] = await connection.execute("SELECT BlockString FROM interview where InterviewID = " + interviewId + ";");
		if (!rows[0])
		{
			res.legal = "false";
			res.reason = "This interviewID does't exist.";
		}
		else // if legal
		{
			res.legal = "true";
			res.reason = "Set BlockString successfully.";
			await connection.execute("update interview set BlockString = '" + blockString + "' where InterviewID = " + interviewId + ";");
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End setBlockStringToDB('" + collegeId + "', '" + interviewId + "', '" + blockString + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "setBlockStringToDB('66', '660000', 'Block: xiangsirzhenshuai')]",
			"legal": "true",
			"reason": "Set BlockString successfully."
		}
		********************** Example **********************/
	}

	this.getVideoPathStringFromDB = async function (collegeId, interviewId)/* fun41 */
	{
		// [Xu] Exp: getVideoPathStringFromDB("66", "660000");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "getVideoPathStringFromDB");
		if (showDetails) console.log("[Start getVideoPathStringFromDB('" + collegeId + "', '" + interviewId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "getVideoPathStringFromDB('" + collegeId + "', '" + interviewId + "')";
		let [rows, fields] = await connection.execute("SELECT VideoPathString FROM interview where InterviewID = " + interviewId + ";");
		if (!rows[0])
		{
			res.legal = "false";
			res.reason = "This interviewID does't exist.";
			res.result = "???";
		}
		else // if legal
		{
			res.legal = "true";
			res.result = rows[0].VideoPathString;
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End getVideoPathStringFromDB('" + collegeId + "', '" + interviewId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "getVideoPathStringFromDB('66', '660000')]",
			"legal": "true",
			"result": "null"
		}
		********************** Example **********************/
	}

	this.setVideoPathStringToDB = async function (collegeId, interviewId, videoPathString)/* fun42 */
	{
		// [Xu] Exp: setVideoPathStringToDB("66", "660000", "VideoPath: xiangsirzhenshuai");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "setVideoPathStringToDB");
		if (showDetails) console.log("[Start setVideoPathStringToDB('" + collegeId + "', '" + interviewId + "', '" + videoPathString + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "setVideoPathStringToDB('" + collegeId + "', '" + interviewId + "', '" + videoPathString + "')";
		let [rows, fields] = await connection.execute("SELECT VideoPathString FROM interview where InterviewID = " + interviewId + ";");
		if (!rows[0])
		{
			res.legal = "false";
			res.reason = "This interviewID does't exist.";
		}
		else // if legal
		{
			res.legal = "true";
			res.reason = "Set VideoPathString successfully.";
			await connection.execute("update interview set VideoPathString = '" + videoPathString + "' where InterviewID = " + interviewId + ";");
		}
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End setVideoPathStringToDB('" + collegeId + "', '" + interviewId + "', '" + videoPathString + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "setVideoPathStringToDB('66', '660000', 'VideoPath: xiangsirzhenshuai')]",
			"legal": "true",
			"reason": "Set BlockString successfully."
		}
		********************** Example **********************/
	}

	this.updateAfterInterviewToDB = async function (collegeId, interviewId)/* fun43 */
	{
		// [Xu] Exp: updateAfterInterviewToDB("66", "660000");
		myconnect.database = "sunshine_" + collegeId;
		await this.logUpdateToDB(collegeId, "updateAfterInterviewToDB");
		if (showDetails) console.log("[Start updateAfterInterviewToDB('" + collegeId + "', '" + interviewId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
		res.functionName = "updateAfterInterviewToDB('" + collegeId + "', '" + interviewId + "')";
		let [rows, fields] = await connection.execute("SELECT StartTimeRecord, EndTimeRecord, BlockString, VideoPathString FROM interview where InterviewID = " + interviewId + ";");
		if (!rows[0])
		{
			res.legal = "false";
			res.reason = "This interviewID does't exist.";
		}
		else // if legal
		{
			res.legal = "true";
			let [rows1, fields1] = await connection.execute("SELECT StartTimeRecord, EndTimeRecord, BlockString, VideoPathString FROM certification.userinfo where InterviewID = " + interviewId + ";");
			res.updateOldInfo = rows1[0];
			res.updateNewInfo = rows[0];
			if (rows[0].StartTimeRecord == null) StartTimeRecord_db = "null";
			else StartTimeRecord_db = "'" + rows[0].StartTimeRecord + "'";
			if (rows[0].EndTimeRecord == null) EndTimeRecord_db = "null";
			else EndTimeRecord_db = "'" + rows[0].EndTimeRecord + "'";
			await connection.execute("update certification.userinfo set StartTimeRecord = " + StartTimeRecord_db + 
				", EndTimeRecord = " + EndTimeRecord_db + 
				", BlockString = '" + rows[0].BlockString + 
				"', VideoPathString = '" + rows[0].VideoPathString +
				"' where InterviewID = " + interviewId + ";");
		}
		let content = JSON.stringify(res, tracer_funTrueFalseDate, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End updateAfterInterviewToDB('" + collegeId + "', '" + interviewId + "')]\n");
		return content;
		/********************** Example **********************
		{
			"functionName": "getVideoPathStringFromDB('66', '660000')]",
			"legal": "true",
			"result": "null"
		}
		********************** Example **********************/
	}
};


//async function main()
//{
//	let res;
//	if (hostfromtxt) myconnect.host = await fs.readFileSync('./host.txt', 'utf8');
//	if (false)
//	{
//	res = await validateFromDB("66", "1101", "1101"); /* fun01 */
//	res = await chooseSideToDB("66", "1101", "teacher"); /* fun02 */
//	res = await resetSideToDB("66", "1201", "student"); /* fun03 */
//	res = await checkSideFromDB("66", "1101", "teacher"); /* fun04 */
//	res = await checkOrderFromDB("66", "1101", "第二场"); /* fun05 */
//	res = await chooseOrderFromDB("66", "1102", "第二场"); /* fun06 */
//	res = await resetOrderFromDB("66", "1102", "第二场"); /* fun07 */
//	res = await teacherSigninToDB("66", "1101", "第一场", "11990005"); /* fun08 */
//	res = await teacherSignoutToDB("66", "1101", "第二场", "11990005"); /* fun09 */
//	res = await studentSigninToDB("66", "1101", "第二场", "11000001"); /* fun10 */
//	res = await studentSignoutToDB("66", "1101", "第二场", "11000001"); /* fun11 */
//	res = await startInterviewToDB("66", "1101", "第一场"); /* fun12 */
//	res = await endInterviewToDB("66", "1101", "第二场"); /* fun13 */
//	res = await resetTimesOfInterviewToDB("66", "1202", "第二场"); /* fun14 */
//	res = await checkStartFromDB("66", "1101", "第二场"); /* fun15 */
//	res = await checkEndFromDB("66", "1101", "第二场"); /* fun16 */
//	res = await checkTeacherSigninFromDB("66", "1101", "第二场", "11990005"); /* fun17 */
//	res = await checkStudentSigninFromDB("66", "1101", "第二场", "11000001"); /* fun18 */
//	res = await checkTeacherSigninPreviousInterviewFromDB("66", "1101", "第二场", "11990005"); /* fun19 */
//	res = await queryStudentFromDB("66", "1101", "第二场"); /* fun20 */
//	res = await getInterViewInfoFromDB("66", "1102", "1102"); /* fun21 */
//	res = await studentQueryOrderFromDB("66", "1101"); /* fun22 */
//	res = await getImgURLFromDB("66", "11990001"); /* fun23*/
//	res = await setImgURLToDB("66", "11000001", "http://ILoveStudy.com/img/11/1.jpg"); /* fun24 */
//	res = await resetStudentImgURLToDB("66", "11000001"); /* fun25 */
//	res = await cleanDataToDB("66"); /* fun26 */
//	}
//	if (true) res = await newSchemaToDB("66"); /* fun27 */
//	if (false) res = await dropSchemaToDB("66"); /* fun28 */
//	if (true)
//	{
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000006", "王靖雯", "4252746483@qq.cn", "18701027128"); /* fun29 */
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000010", "张梓恒", "1239690265@qq.cn", "18702634284");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000014", "魏民谣", "4139955523@qq.cn", "13711852218");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000018", "杨芊慧", "4063755300@qq.cn", "13917028903");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000002", "赵子曦", "2424046755@qq.cn", "18892748534");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000019", "杨宏亮", "1528349932@qq.cn", "13412384996");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000003", "李明泽", "2499943327@qq.cn", "18651954818");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000007", "王琛杰", "614444238@qq.cn", "13453916075");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000011", "吴所谓", "4550700454@qq.cn", "13480258914");
//	res = await insertStudentTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000015", "陈逸轩", "3474446654@qq.cn", "18495570983");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000012", "包青白", "3381875904@qq.cn", "13413054593");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000016", "陈思宇", "712769062@qq.cn", "13389820840");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000000", "赵星儿", "307748470@qq.cn", "18327519127");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000004", "李承淅", "3731831085@qq.cn", "13754572439");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11000008", "王易卓", "4214524971@qq.cn", "18783245155");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000001", "赵汐悦", "1410057125@qq.cn", "18683179950");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000005", "李昕睿", "1807089478@qq.cn", "13779837466");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000009", "张晨皓", "4640351021@qq.cn", "13692528790");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000013", "白读书", "3212956973@qq.cn", "13954859886");
//	res = await insertStudentTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11000017", "陈一铭", "4643880864@qq.cn", "13350453791");
//	res = await insertTeacherTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11990002", "张建龙", "1008066205@zz.edu.cn", "13346669064", "化学");/* fun30 */
//	res = await insertTeacherTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11990006", "陈鸿玉", "1004408279@zz.edu.cn", "13415299709", "哲学");
//	res = await insertTeacherTakesToDB("66", "燕园楼816教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11990010", "林妍", "1001137881@zz.edu.cn", "13580933067", "生物");
//	res = await insertTeacherTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11990011", "谢子琦", "1006743071@zz.edu.cn", "18508685888", "哲学");
//	res = await insertTeacherTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11990003", "蔡文化", "1003931556@zz.edu.cn", "18990367691", "艺术");
//	res = await insertTeacherTakesToDB("66", "燕园楼816教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11990007", "杨文锦", "1002986067@zz.edu.cn", "18794387510", "中文");
//	res = await insertTeacherTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11990004", "甄红", "1009127187@zz.edu.cn", "13898422837", "中文");
//	res = await insertTeacherTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11990005", "贾紫", "1007576950@zz.edu.cn", "18456223339", "物理");
//	res = await insertTeacherTakesToDB("66", "第九教学楼305教室", "2019-06-11 09:00:00", "2019-06-11 09:50:00", "11990008", "吴志远", "1004371808@zz.edu.cn", "18301725555", "艺术");
//	res = await insertTeacherTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11990001", "赵一凡", "1005185348@zz.edu.cn", "18515418788", "艺术");
//	res = await insertTeacherTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11990005", "贾紫", "1007576950@zz.edu.cn", "18456223339", "物理");
//	res = await insertTeacherTakesToDB("66", "第九教学楼305教室", "2019-06-11 10:00:00", "2019-06-11 10:50:00", "11990009", "吴维平", "1003322011@zz.edu.cn", "18499551624", "数学");
//	res = await buildTablesToDB("66"); /* fun31 */
//	}
//	//await test();
//	//console.log(res);
//}
//main();
//

