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
        CollegeID: '',
        vList: ['http://video.chinanews.com/flv/gg/170918/1.mp4',
          'http://videoclips.chinanews.com/oss/onair/zxw/szuser/9d28c42f4e654ed2baffe606f0b9ef48_37.mp4',
          'http://video.chinanews.com/flv/2018/06/29/400/98482_web.mp4']
      }
    },
    methods: {
      search () {
        let _this = this;
        $.ajax({
          url: "/apis/search",
          type: "post",
          data: JSON.stringify({
            studentID: _this.StudentID,
            // password: encryptor.encrypt(_this.password, secretKey, 256),
            collegeID: _this.CollegeID,
          }),
          async: true,
          success: function (data, stats) {
            data = JSON.parse(data);
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
            _this.$globalVar.setvList(data.videos.urls);
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
