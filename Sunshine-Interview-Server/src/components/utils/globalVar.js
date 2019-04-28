export default {
  collegeID: -1,
  vList: [],
  studentName: '',
  exam: '',
  time: '',
  blockID: '',
  /*
  * we will store following information in sessionStorage:
  * "collegeID" :
  * "loginState" : enum{"teacher", "student", "school"}
  * "uploaded": enum{"true", "false"} // 表示教务人员有没有上传考官和考生信息
   */

  setCollegeID: function(arg){
    this.collegeID = arg;
  },

  setvList: function(arg){
    this.vList = arg;
  },

  setStudentName: function(arg) {
    this.studentName = arg;
  },

  setExam: function(arg) {
    this.exam = arg;
  },

  setTime: function(arg) {
    this.time = arg;
  },

  setBlockID: function(arg) {
    this.blockID = arg;
  },

  resetCollegeID: function (arg) {
    this.collegeID = -1;
  },

  setStorage: function (content) {
    /*
    * content like
    * {
    *   key(str): value(str),
    *   ...
    * }
     */
    for (let key in content)
      sessionStorage.setItem(key, content[key]);
  },

  getStorage: function (key) {
    /*
    * key(str)
     */
    if (sessionStorage.getItem(key) != null)
      return sessionStorage.getItem(key);
    else
      return "";
  },

  checkLogin: function () {
    return this.getStorage("collegeID") !== "";
  },

  checkIfTeacher: function () {
    return this.getStorage("loginState") === "teacher";
  },

  checkIfStudent: function () {
    return this.getStorage("loginState") === "student";
  },

  checkIfSchool: function () {
    return this.getStorage("loginState") === "school";
  }
}
