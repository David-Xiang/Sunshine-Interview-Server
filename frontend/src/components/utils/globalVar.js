export default {
  collegeID: -1,
  vList: [],
  studentName: '',
  exam: '',
  site: '',
  startTime: '',
  endTime: '',
  blockID: '',
  studentList: [],
  teacherList: [],
  min: 0,
  sec: 0,
  studentID: -1,
  total: -1,
  hashArray: [],
  imgUrl: '',
  /*
  * we will store following information in sessionStorage:
  * "collegeID" :
  * "loginState" : enum{"teacher", "student", "school"}
  * "uploaded": enum{"true", "false"} // 表示教务人员有没有上传考官和考生信息
   */

  setCollegeID: function(arg){
    this.collegeID = arg;
  },

  setSite: function(arg){
    this.site = arg;
  },

  setvList: function(arg){
    this.vList = arg;
  },
  setStudentList: function(arg){
    this.studentList = arg;
  },
  setTeacherList: function(arg){
    this.teacherList = arg;
  },

  setStudentName: function(arg) {
    this.studentName = arg;
  },

  setExam: function(arg) {
    this.exam = arg;
  },

  setStartTime: function(arg) {
    this.startTime = arg;
  },

  setEndTime: function(arg) {
    this.endTime = arg;
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

  clearStorage: function(){
    sessionStorage.clear();
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
