<template>
  <div class = "content">
    <section class="content-header">
      <h1>
        查验视频
        <small>Check</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#/"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li class="active">查验视频</li>
      </ol>
    </section>

    <section class="content">
      <div class="box box-danger">
        <div class="box-header">
          <h3 class="box-title">请输入查验信息</h3>
        </div>
        <div class="box-body">
          <div class="form-group">
            <label>学校编码</label>
            <div class="input-group">
              <span class="input-group-addon">@</span>
              <input type="number" class="form-control" v-model="CollegeID" placeholder="请填写学校编码">
            </div>
          </div>
          <div class="form-group">
            <label>参与者id</label>
            <div class="input-group">
              <span class="input-group-addon">@</span>
              <input type="number" class="form-control" v-model="StudentID" placeholder="请填写考官或考生id">
            </div>
          </div>
          <div class="from-group">
            <label>视频源</label>
            <div>
              <input type="checkbox" checked=true class="checkServer" value="0" v-on:click="checkClick(0)">阳光面试服务器&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="checkbox" class="checkServer" value="1" v-on:click="checkClick(1)">教育部服务器&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="checkbox" class="checkServer" value="2" v-on:click="checkClick(2)">高校联盟服务器&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          <div class="box-footer">
            <!--router-link to="/watch"-->
            <button type="submit" class="btn btn-danger" v-on:click="search()">查询</button>
            <!--/router-link-->
          </div>
          <!-- /.box-body -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'searchVideo',
    data () {
      return {
        StudentID: '',
        source:"0",
        CollegeID: '',
        vList: ['http://video.chinanews.com/flv/gg/170918/1.mp4',
          'http://videoclips.chinanews.com/oss/onair/zxw/szuser/9d28c42f4e654ed2baffe606f0b9ef48_37.mp4',
          'http://video.chinanews.com/flv/2018/06/29/400/98482_web.mp4']
      }
    },
    methods: {
      checkClick: function(value) {
        // console.log("checkbox clicked");
        let checkboxes = document.getElementsByClassName("checkServer");
        // console.log(checkboxes);
        for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            checkboxes[i].checked = false;
            // break;
          }
        }
        checkboxes[value].checked = true;
        this.source = String(value);
        console.log(this.source);
      },
      search () {
        let _this = this;
        $.ajax({
          url: "/apis/apis/search",
          type: "post",
          data: JSON.stringify({
            studentID: _this.StudentID,
            // password: encryptor.encrypt(_this.password, secretKey, 256),
            collegeID: _this.CollegeID,
            source:_this.source,
          }),
          async: true,
          success: function (data, stats) {
            data = JSON.parse(data);
            console.log(data);
            console.log("receive video list request:", data);
            if (!data.hasOwnProperty("result")){
              alert("考官/考生ID或学校编码有误，请重试");
              _this.StudentID = '';
              _this.CollegeID = '';
              return;
            }
            if (data.result === "false"){
              alert("考官/考生ID或学校编码有误，请重试");
              _this.StudentID = '';
              _this.CollegeID = '';
              return;
            }
            _this.$globalVar.setvList(data.videos.info);
            _this.$globalVar.setStudentList(data.studentinfo);
            _this.$globalVar.setTeacherList(data.teacherinfo);
            _this.$globalVar.setExam(data.interviewName);
            _this.$globalVar.setSite(data.interviewSiteName);
            _this.$globalVar.setStartTime(data.startTimeRecord);
            _this.$globalVar.setEndTime(data.endTimeRecord);
            _this.$globalVar.setStudentName(data.studentName);
            _this.$globalVar.setStorage(
              {
                "vUrlList": JSON.stringify(data.videos.info),
                "vStudentList": JSON.stringify(data.studentinfo),
                "vTeacherList": JSON.stringify(data.teacherinfo),
                "studentName": data.studentName,
                "exam": data.interviewName,
                "site": data.interviewSiteName,
                "startTime": data.startTimeRecord,
                "endTime": data.endTimeRecord,
                'blockID': data.blockString
              }
            );
            _this.$router.replace('/watch');
          },
          error: function () {
            alert("网络请求错误，请重试！");
          }
        });
        // this.$root.eventHunb.$emit("eventName",this.vList)
      },
    }
  }
</script>

<style scoped>

</style>
