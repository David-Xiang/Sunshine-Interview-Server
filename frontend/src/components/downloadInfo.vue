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
      <div class="box box-danger" style="min-height: 500px">
        <div class="box-header with-border">
          <h3 class="box-title">上传成功！</h3>
        </div>
        <div style="text-align: center;">请下载<a v-on:click="download">所创建考试考场号及验证码</a></div>
      </div>
    </section>
    <!-- /.content -->
  </div>
</template>

<script>
export default {
  name: 'downloadInfo',
  data (){
    return {
      validationCode: {}
    }
  },
  methods: {
    download: function () {
      // this.validationCode = {
      //   legal: true,
      //   info:[
      //     {
      //       InterviewSiteID:6600,
      //       InterviewSiteName:"燕园楼816教室",
      //       Password:"4742"
      //     },
      //     {
      //       InterviewSiteID:6601,
      //       InterviewSiteName:"第九教学楼305教室",
      //       Password:"7621"
      //     },
      //   ]
      // };

      console.log("download called!");
      console.log(this.validationCode["legal"]);
      if (this.validationCode["legal"] !== "true")
        return;
      let resStr = "";
      resStr += "InterviewSiteID, InterviewSiteName, Password\r\n";
      for (let i = 0; i < this.validationCode.info.length; i++){
        resStr += this.validationCode.info[i]["InterviewSiteID"];
        resStr += ", ";
        resStr += this.validationCode.info[i]["InterviewSiteName"];
        resStr += ", ";
        resStr += this.validationCode.info[i]["Password"];
        resStr += "\r\n";
      }

      console.log("generate string", resStr);

      this.downloadFile(resStr, "ValidationCode.csv");
    },

    downloadFile: function(content, filename){
      let newLink = document.createElement("a");
      newLink.download = filename;
      newLink.style.display = "none";
      content = "\ufeff" + content; // 否则用excel打开这个文件,中文会乱码
      let blob = new Blob([content],  { type: 'text/csv,charset=UTF-8', endings: 'native' });
      newLink.href = window.URL.createObjectURL(blob);
      document.body.appendChild(newLink);
      newLink.click();
      document.body.removeChild(newLink);
      window.URL.revokeObjectURL(blob);
    }
  },
  mounted() {
    let _this = this;
    if (_this.$globalVar.getStorage("uploaded") !== "true"){
      alert("您还未完成上传信息任务，无法下载！");
      _this.$router.replace('/addinformation');
    }

    $.ajax({
      url: "/apis/sitetable?collegeid=" + _this.$globalVar.getStorage("collegeID"),
      type: "get",
      //data: JSON.stringify({collegeid:_this.$globalVar.collegeID}),
      success: function (data, stats) {
        _this.validationCode = JSON.parse(data);
        console.log(_this.validationCode);
      },
      error: function (error) {
        alert("网络请求出错，请重试");
        console.log(error);
      }
    })
  }
}
</script>

<style scoped>
  a{
    cursor: pointer;
  }
</style>
