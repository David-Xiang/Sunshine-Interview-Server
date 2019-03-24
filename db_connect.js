/*************************************************
Copyright		: Sunshine
Author			: Xu
Startdate		: 2019-03-19 22:19:12
Finishdate		: 2019-03-21 02:40:07
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
	const showDetails = true;
	const showJson = true;
	const hostfromtxt = true;

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

	this.validateFromDB = async function (siteId, validateCode)/* fun01 */
	{
		// [Xu] Exp: validateFromDB("1101", "1101");
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

	this.chooseSideToDB  =async function (siteId, side)/* fun02 */
	{
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

	this.resetSideToDB = async function (siteId, side)/* fun03 */ /* Contrary to fun02: chooseSideToDB */
	{
		// [Xu] side MUST be "teacher", "TEACHER", "student" or "STUDENT"
		// [Xu] Exp: resetSideToDB("1101", "teacher");
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

	this.checkSideFromDB = async function (siteId, side)/* fun04 */
	{
		// if this side hasn't been chosen, return true
		// [Xu] side MUST be "teacher", "TEACHER", "student" or "STUDENT"
		// [Xu] Exp: checkSideFromDB("1101", "teacher");
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

	this.checkOrderFromDB = async function (siteId, order)/* fun05 */
	{
		// if this order hasn't been chosen, return true
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: checkOrderFromDB("1101", "2");
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

	this.chooseOrderToDB = async function (siteId, order)/* fun06 */
	{
		// IMPORTANT
		// set current pair relation to (TEACHER WAIT FOR STUDENT)
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: chooseOrderToDB("1101", "2");
		if (showDetails) console.log("[Start chooseOrderToDB('" + siteId + "','" + order + "')]");
		let nowTime = new Date();
		let nowTime_db = nowTime.Format("yyyyMMddhhmmss");
		let nowTime_js = nowTime.Format("yyyy-MM-dd hh:mm:ss");
		let connection = await mysql.createConnection(myconnect);
		let [rows, fields] = await connection.execute("SELECT Chosen as 'chosen', ChosenTime as 'chosenTime' FROM interview where InterviewSiteID = " + siteId + " and OrderNumber = '" + order + "';");
		let res = {};
		res.functionName = "chooseOrderToDB('" + siteId + "','" + order + "')";
		if (!rows[0]) res.legal = "false"; // if illegal
		else // if legal
		{
			res.legal = "true";
			res.oldChosen = rows[0].chosen;
			res.newChosen = "true";
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

	this.resetOrderFromDB = async function (siteId, order)/* fun07 */ /* Contrary to fun06: chooseOrderToDB */
	{
		// IMPORTANT
		// set current pair relation to (TEACHER WAIT FOR STUDENT)
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: resetOrderFromDB("1102", "2");
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

	this.teacherSigninToDB = async function (siteId, order, id)/* fun08 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: teacherSigninToDB("1101", "2", "11990005");
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

	this.teacherSignoutToDB = async function (siteId, order, id)/* fun09 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: teacherSignoutToDB("1101", "2", "11990005");
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

	this.studentSigninToDB = async function (siteId, order, id)/* fun10 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: studentSigninToDB("1101", "2", "11000001");
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

	this.studentSignoutToDB = async function (siteId, order, id)/* fun11 */
	{
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: studentSignoutToDB("1101", "2", "11000001");
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

	this.startInterviewToDB = async function (siteId, order)/* fun12 */
	{
		// [Xu] Exp: startInterviewToDB("1101", "2");
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

	this.endInterviewToDB = async function (siteId, order)/* fun13 */
	{
		// [Xu] Exp: endInterviewToDB("1101", "2");
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

	this.resetTimesOfInterviewToDB = async function (siteId, order)/* fun14 */ /* Set StartTimeRecord, EndTimeRecord, ChosenTime to null and Set Chosen to 0(default value)*/
	{
		// [Xu] Exp: resetTimesOfInterviewToDB("1101", "2");
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

	this.checkStartFromDB = async function (siteId, order)/* fun15 */
	{
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: checkStartFromDB("1101", "2");
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

	this.checkEndFromDB = async function (siteId, order)/* fun16 */
	{
		// [Xu] order is also a string like "1", "3"
		// [Xu] Exp: checkEndFromDB("1101", "2");
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

	this.checkTeacherSigninFromDB = async function (siteId, order, id)/* fun17 */
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

	this.checkStudentSigninFromDB = async function (siteId, order, id)/* fun18 */
	{
		// if this person hasn't been chosen, return true
		// VERY IMPORTANT: 
		// we suppose once a teacher has sign in this site in previous order,
		// he won't need to sign in again
		// (student won't sign in repeatedly)
		// [Xu] id is also a string like "11990001", "12990002"
		// [Xu] ids for students are like "XX00XXXX", while "XX99XXXX" for teachers
		// [Xu] Exp: checkStudentSigninFromDB("1101", "2", "11000001");
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

	this.checkTeacherSigninPreviousInterviewFromDB = async function(siteId, order, id)/* fun19 */ /* VERY IMPORTANT */
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

	this.queryStudentFromDB = async function (siteId, order)/* fun20 */
	{
		// return a list of student info consists of id, name, is_absent and img_url
		// [Xu] Exp: queryStudentFromDB("1101", "2");
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

	this.getInterViewInfoFromDB = async function (siteId, validateCode)/* fun21 */
	{
		// [Xu] Exp: getInterViewInfoFromDB("1102", "1102");
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
				let [rows2, fields2] = await connection.execute("SELECT OrderNumber as 'order', StartTime as 'start_time', EndTime as 'end_time', StartTimeRecord as 'start_time_record', EndTimeRecord as 'end_time_record' FROM interview where InterviewSiteID = " + siteId + " and StartTimeRecord is null;");
				
				for (let period in rows2)
				{
					//console.log(rows2[period]);
					let [rows3, fields3] = await connection.execute("SELECT b.TeacherID as 'id', b.TeacherName as 'name' FROM teacher_takes as a, teacher as b where a.TeacherID = b.TeacherID and a.InterviewSiteID = " + siteId + " and a.OrderNumber = '" + rows2[period].order + "';");
					rows2[period].teacher = rows3;
					for (let oneteacher in rows3)
					{
						let ask = await this.checkTeacherSigninPreviousInterviewFromDB(siteId, rows2[period].order, rows3[oneteacher].id);
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
					"college_name": "北京可爱大学",
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

	this.studentQueryOrderFromDB = async function (siteId)/* fun22 */
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
		let maxInterval = 180;
		let nowTime = new Date();
		let nowTime_seconds = nowTime.Format("hhmmss");
		let nowTime_js = nowTime.Format("yyyy-MM-dd hh:mm:ss");
		if (showDetails) console.log("[Start studentQueryOrderFromDB('" + siteId + "')]");
		let connection = await mysql.createConnection(myconnect);
		let [rows0, fields0] = await connection.execute("select OrderNumber as 'order', ChosenTime as'chosen_time' from interview where Chosen = 1 and InterviewSiteID = " + siteId + " order by ChosenTime DESC;");
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
					"order": 2,
					"chosen_time": "2019-03-21 02:33:40"
			}
		}
		********************** Example **********************/
	}

	this.getImgURLFromDB = async function (id)/* fun23 */
	{
		// [Xu] Exp: getImgURLFromDB("11000001");
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

	this.setImgURLToDB = async function (id, url)/* fun24 */
	{
		// [Xu] Exp: setImgURLTomDB("11000001", "http://ILoveStudy.com/img/11/1.jpg");
		if (showDetails) console.log("[Start setImgURLToDB('" + id + "', '" + url + "')]");
		let connection = await mysql.createConnection(myconnect);
		let res = {};
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
				await connection.execute("UPDATE teacher SET ImgURL = '" + url + "' where TeacherID = " + id + ";");
			}
		}
		else // if legal
		{
			res.legal = "true";
			res.side = "student";
			res.oldImgURL = rows[0].ImgURL;
			res.newImgURL = url;
			await connection.execute("UPDATE student SET ImgURL = '" + url + "' where StudentID = " + id + ";");
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

	this.resetStudentImgURLToDB = async function (id)/* fun25 */
	{
		// [Xu] Exp: resetImgURLTomDB("11000001", "http://ILoveStudy.com/img/11/1.jpg");
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
	
	this.cleanData = async function ()/* fun26 */
	{
		// [Xu] Exp: cleanAll();
		if (showDetails) console.log("[Start cleanData()");
		let connection = await mysql.createConnection(myconnect);
		await connection.execute("update interviewsite set TeacherSideChosen = 0, StudentSideChosen = 0;");
		await connection.execute("update interview set StartTimeRecord = null, EndTimeRecord = null, Chosen = 0, ChosenTime = null;");
		await connection.execute("update teacher_takes set signin = 0;");
		await connection.execute("update student_takes set signin = 0;");
		let res = {};
		res.functionName = "cleanData()";
		res.legal = "true";
		res.result = "true";
		let content = JSON.stringify(res, null, '\t');
		if (showJson) console.log(content);
		await connection.end();
		if (showDetails) console.log("[End cleanData()");
		return content;
		/********************** Example **********************
		{
			"functionName": "cleanData()",
			"legal": "true",
			"result": "true"
		}
		********************** Example **********************/
	}
};


// async function main()
// {
// 	let res;
// 	if (hostfromtxt) myconnect.host = await fs.readFileSync('./host.txt', 'utf8');
// 	res = await validateFromDB("1101", "1101"); /* fun01 */
// 	res = await chooseSideToDB("1101", "teacher"); /* fun02 */
// 	res = await resetSideToDB("1101", "teacher"); /* fun03 */
// 	res = await checkSideFromDB("1101", "teacher"); /* fun04 */
// 	res = await checkOrderFromDB("1101", "2"); /* fun05 */
// 	res = await chooseOrderToDB("1102", "2"); /* fun06 */
// 	res = await resetOrderFromDB("1102", "2"); /* fun07 */
// 	res = await teacherSigninToDB("1101", "1", "11990005"); /* fun08 */
// 	res = await teacherSignoutToDB("1101", "2", "11990005"); /* fun09 */
// 	res = await studentSigninToDB("1101", "2", "11000001"); /* fun10 */
// 	res = await studentSignoutToDB("1101", "2", "11000001"); /* fun11 */
// 	res = await startInterviewToDB("1101", "2"); /* fun12 */
// 	res = await endInterviewToDB("1101", "2"); /* fun13 */
// 	res = await resetTimesOfInterviewToDB("1101", "2"); /* fun14 */
// 	res = await checkStartFromDB("1101", "2"); /* fun15 */
// 	res = await checkEndFromDB("1101", "2"); /* fun16 */
// 	res = await checkTeacherSigninFromDB("1101", "2", "11990005"); /* fun17 */
// 	res = await checkStudentSigninFromDB("1101", "2", "11000001"); /* fun18 */
// 	res = await checkTeacherSigninPreviousInterviewFromDB("1101", "2", "11990005"); /* fun19 */
// 	res = await queryStudentFromDB("1101", "2"); /* fun20 */
// 	res = await getInterViewInfoFromDB("1102", "1102"); /* fun21 */
// 	res = await studentQueryOrderFromDB("1101"); /* fun22 */
// 	res = await getStudentImgURLFromDB("11000001"); /* fun23*/
// 	res = await setStudentImgURLToDB("11000001", "http://ILoveStudy.com/img/11/1.jpg"); /* fun24 */
// 	res = await resetStudentImgURLToDB("11000001"); /* fun25 */
// 	//console.log(res);
// }
// main();

