export default {
  collegeID: -1,
  vList: [],
  studentName: '',
  exam: '',
  time: '',
  blockID: '',

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
  }
}
