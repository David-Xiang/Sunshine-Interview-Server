<template>
  <div class="content" style="min-height: 1170px;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        新建考试
        <small>New exam</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#/"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li><a href="#/">设置考试信息</a></li>
        <li class="active">新建考试</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content">

      <!-- Default box -->
      <div class="box box-danger">
        <div class="box-header with-border">
          <h3 class="box-title">考试相关信息</h3>
        </div>
        <!-- /.box-header -->
        <!-- form start -->
        <form role="form">
          <div class="box-body">
            <div class="form-group">
              <label for="examName">考试名称</label>
              <input type="text" class="form-control" id="examName" placeholder="请输入考试名称">
            </div>
            <div class="form-group">
              <label>下载考生信息模板</label>
              <a href="/apis/download/studentInput1.xlsx" download="studentInputModel.xlsx">下载</a>
            </div>
            <div class="form-group">
              <label>下载考官信息模板</label>
              <a href="/apis/download/teacherInput1.xlsx" download="teacherInputModel.xlsx">下载</a>
            </div>
            <div class="form-group">
              <label for="exampleInputFile">上传考生信息</label>
              <input type="file" v-on:change="studentFile($event)" id="exampleInputFile">

              <p class="help-block">请勿修改表格格式</p>
            </div>
            <div class="form-group">
              <label for="exampleInputFile1">上传考官信息</label>
              <input type="file" v-on:change="teacherFile($event)" id="exampleInputFile1">

              <p class="help-block">请勿修改表格格式</p>
            </div>
          </div>
          <!-- /.box-body -->

          <div class="box-footer">
            <button type="button" v-on:click="uploadInfo" v-bind:disabled="disableButton" class="btn btn-danger">提交</button>
          </div>
          <div v-if="textDisplayDisabled">
            <p class="help-block">正在上传中，请不要离开...</p>
          </div>
          <div style="width:80%">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="uploadPercentage"></el-progress>
          </div>

        </form>
      </div>
    </section>
    <!-- /.content -->
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'add',
  data () {
    return {
      teacherInfo:[],
      studentInfo:[],
      collegeID:"",
      userimg: require('../assets/bigbrother.png'),
      sessionid:"",
      uploadPercentage:0,
      textDisplayDisabled:false,
      disableButton:false
    }
  },
  methods: {
    transferTimeStr: function(inputStr){
      // inputStr = "6/11/19 9:00"
      // return inputStr;
      let date = inputStr.split(" ")[0];
      let time = inputStr.split(" ")[1];
      let datelist = date.split("/");
      if (datelist[0].length === 1)
        datelist[0] = '0' + datelist[0];
      if (datelist[1].length === 1)
        datelist[1] = '0' + datelist[1];
      datelist[2] = "20" + datelist[2];
      let newDate = datelist[2] + "-" + datelist[0] + "-" + datelist[1];
      let timelist = time.split(":");
      if (timelist[0].length === 1)
        timelist[0] = "0" + timelist[0];
      let newTime = timelist[0] + ":" + timelist[1];
      return newDate + " " +  newTime;
    },

    rr: function() {
      console.log("rr called with sessionId:" + this.sessionid);
      let _this = this;
      if (_this.sessionid === "")
        return;
      $.ajax({
        url: "/tableprocess?sessionid=" + _this.sessionid,
        type:"get",
        success: function (data, stats) {
          data = JSON.parse(data);
          if (!data.hasOwnProperty("inserted") || !data.hasOwnProperty("total")) {
            return;
          }
          else {
            if (data["inserted"] === data["total"])
              _this.$router.replace("/download");
            else {
              _this.uploadPercentage = Math.floor(data["inserted"] / data["total"] * 100);
              setTimeout(function () {
                _this.rr();
              }, 2000);
            }
          }
        },
        error: function (err) {
          alert("连接丢失，请重新上传");
          _this.uploadPercentage = 0;
          _this.disableButton = false;
        }
      })
    },

    cmp: function(a, b)
    {
      if (a["StartTime"] !== b["StartTime"])
        return a["StartTime"] - b["StartTime"];
      if (a["EndTime"] !== b["EndTime"])
        return a["EndTime"] - b["EndTime"];
      return a["InterviewSiteName"] > b["InterviewSiteName"];
    },

    checkCrush: function(){
      /*
      CollegeID: 66
      DeptName: "物理"
      Email: "1004733437@zz.edu.cn"
      EndTime: "2019-06-12 14:50"
      InterviewSiteName: "未名楼102教室"
      PhoneNumber: "18812714365"
      StartTime: "2019-06-12 14:00"
      TeacherID: "12990002"
      TeacherName: "沈英英"
       */
      //return false;
      // if (!this.teacherInfo instanceof Array || !this.studentInfo instanceof Array){
      //   return true;
      // }
      // if (this.teacherInfo.length === 0 || this.studentInfo.length === 0){
      //   return true;
      // }

      let tmpT = [].concat(this.teacherInfo);
      let tmpS = [].concat(this.studentInfo);

      tmpT.sort(this.cmp);
      tmpS.sort(this.cmp);

      console.log("compare!!!!");
      console.log(JSON.stringify(tmpT));
      console.log(JSON.stringify(tmpS));

      let Tst = 0;
      let j = 0;
      for (let i = 1; i < tmpT.length; i++) {
        if (tmpT[i]["StartTime"] === tmpT[Tst]["StartTime"] &&
          tmpT[i]["EndTime"] !== tmpT[Tst]["EndTime"] &&
          tmpT[i]["InterviewSiteName"] === tmpT[Tst]["InterviewSiteName"]) {

          console.log(1, Tst, i);
          console.log(tmpT[Tst]);
          console.log(tmpT[i]);
          return true;
        }
        else if(tmpT[i]["StartTime"] !== tmpT[Tst]["StartTime"] ||
          tmpT[i]["EndTime"] !== tmpT[Tst]["EndTime"] ||
          tmpT[i]["InterviewSiteName"] !== tmpT[Tst]["InterviewSiteName"]){
          let matchFlag = false;
          for (; j < tmpS.length; j++) {
            if (tmpS[j]["StartTime"] === tmpT[Tst]["StartTime"] &&
              tmpS[j]["EndTime"] === tmpT[Tst]["EndTime"] &&
              tmpS[j]["InterviewSiteName"] === tmpT[Tst]["InterviewSiteName"])
              matchFlag = true;
            else {
              break;
            }
          }
          if (!matchFlag){
            console.log(1, Tst, j);
            console.log(tmpT[Tst]);
            console.log(tmpS[j]);
            return true;
          }
          Tst = i;
        }
      }
      return false;
    },
    uploadInfo: function(){
      if (this.checkCrush()) {
        alert("格式有误，请重新上传");
        return;
      }
      //alert("before post");
      //console.log(this.teacherInfo, this.);
      let _this = this;
      _this.textDisplayDisabled = true;

      $.ajax({
        url: "/apis/register",
        type:"post",
        data:JSON.stringify({student:_this.studentInfo, teacher:_this.teacherInfo}),
        success:function (data, stats) {
          console.log("post succeed! with response: " + data);
          data = JSON.parse(data);
          _this.$globalVar.setStorage({
            "uploaded": "true"
          });
          _this.sessionid = data["sessionId"];
          _this.disableButton = true;
          _this.rr();
        },
        error: function (error) {
          console.log(error);
        }
      });
    },
    studentFile: function(event){
      let file = event.target.files[0];
      this.readFile(file, true);
    },
    teacherFile: function(event){
      let file = event.target.files[0];
      this.readFile(file, false);
    },
    readFile : function(file, isStu) {
      let reader = new FileReader();
      let content = {};

      reader.onload = (e) =>{
        try {
          let data = e.target.result;
          content = XLSX.read(data, {type: "array"});
        }
        catch(e) {
          alert("Error!");
          return;
        }
        let res = [];
        for (let sheet in content.Sheets)
        {
          if (content.Sheets.hasOwnProperty(sheet)) {
            res = res.concat(XLSX.utils.sheet_to_json(content.Sheets[sheet]));
          }
        }

        //console.log("result length:", res.length);
        for (let key = 0; key < res.length; key++){
          // console.log(res[key]);
          if (res[key].hasOwnProperty("StartTime"))
            res[key]["StartTime"] = this.transferTimeStr(res[key]["StartTime"]);
          else{
            console.log("Error!");
            return;
          }
          if (res[key].hasOwnProperty("EndTime"))
            res[key]["EndTime"] = this.transferTimeStr(res[key]["EndTime"]);
          else {
            console.log("Error!");
            return;
          }

          res[key]['CollegeID'] = this.$globalVar.getStorage("collegeID");
          console.log(res[key]['CollegeID']);
          //console.log(res[key]);
        }

        if (isStu) {
          this.studentInfo = [].concat(res);
          //console.log("this.studentInfo modified:", this.studentInfo);
        }
        else{
          this.teacherInfo = [].concat(res);
          console.log("this.teacherInfo modified:", this.teacherInfo);
        }
      };
      //reader.readAsBinaryString(file);
      reader.readAsArrayBuffer(file)
    },
  }
}
</script>

<style scoped>

</style>
