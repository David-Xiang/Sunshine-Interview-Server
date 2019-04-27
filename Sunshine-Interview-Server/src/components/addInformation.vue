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
            <button type="button" v-on:click="uploadInfo" class="btn btn-danger">提交</button>
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
      // TODO:
      teacherInfo:[],
      studentInfo:[],
      collegeID:"",
      userimg: require('../assets/bigbrother.png')
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
      return newDate + " " + newTime;
    },
    checkCrush: function(){
      return false;
      if (!this.teacherInfo instanceof Array || !this.studentInfo instanceof Array){
        return true;
      }
      if (this.teacherInfo.length === 0 || this.studentInfo.length === 0){
        return true;
      }

      let tmpT = [].concat(this.teacherInfo);
      let tmpS = [].concat(this.studentInfo);
      return false;
    },
    uploadInfo: function(){
      if (this.checkCrush()) {
        alert("格式有误，请重新上传");
        return;
      }
      alert("before post");
      //console.log(this.teacherInfo, this.);
      let _this = this;

      $.ajax({
        url: "/apis/register",
        type:"post",
        data:JSON.stringify({student:_this.studentInfo, teacher:_this.teacherInfo}),
        success:function (data, stats) {
          console.log("yes!!!!!!");
          _this.$router.replace('/download');
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

          res[key]['CollegeID'] = this.$globalVar.collegeID;
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
