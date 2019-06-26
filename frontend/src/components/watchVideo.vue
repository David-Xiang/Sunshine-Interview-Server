<template>
  <div class = "content">
  <section class="content-header">
    <h1>
      观看视频录像
      <small>Check</small>
    </h1>
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
      <li><a href="#/search"><i class="fa fa-dashboard"></i> 查验视频</a></li>
      <li class="active">查看视频</li>
    </ol>
  </section>
    <section class="content">
      <div class="row">
        <div class="col-lg-4 col-xs-6">
      <div class="test_two_box">
        <video
          id="myVideo"
          class="video-js"
        >
          <source
            src="//vjs.zencdn.net/v/oceans.mp4"
            type="video/mp4"
          >
        </video>
      </div>
        </div>
        <div class="col-lg-4 col-xs-6"></div>
        <div class="col-lg-4 col-xs-6 bg-red">
          <div class="inner">
          <span class="info-box-icon"><i class="fa fa-bookmark-o"></i></span>
          <div class="info-box-content">
            <h5>    考试：{{exam}}</h5>
            <h5>    考场：{{site}}</h5>
            <h5>    开始时间：{{startTime}}</h5>
            <h5>    结束时间：{{endTime}}</h5>
            <h5>    参与者：{{studentName}}</h5>
            <h5>    该视频片段的链上哈希值：</h5>
            <h6>    {{hashChain[videoIndex]}}</h6>
            <h5>    来自该服务器的视频文件的哈希值：</h5>
            <h6>    {{hashFile[videoIndex]}}</h6>
            <h5>    验证结果：{{hashChain[videoIndex] == hashFile[videoIndex] ? "Success" : "Fail"}}</h5>
            <!--h5>    {{vList[videoIndex].hashChain}}</h5-->
            <!--h4>    当前播放视频片段：第 {{current + 1}} 段</h4-->
          </div>
          </div>
      </div>
      </div>
    </section>
      <section class="content">
      <div class="row">
        <div class="col-lg-4 col-xs-6">
        <h3>
          视频列表
        </h3>
        <div class="video-list">
          <div  v-for="(video, index) in vList" :key="video.id">
            <button type="button" class="btn btn-danger pull-left" style="margin-right: 5px;" v-on:click="changeVideo(index)">
              {{index + 1}}
            </button>
          </div>
        </div>
      </div>
      </div>
      </section>
    <section class="content">
        <div class="row">
          <div class="col-lg-4 col-xs-6">
            <h3>本场考生：</h3>
          <div class="student-list">
            <div  v-for="(student, index) in studentList" :key="student.id">
              <h4> {{student.StudentName}}</h4>
            </div>
          </div>
          </div>
          <div class="col-lg-4 col-xs-6">
            <div class="teacher-list">
              <h3>本场面试官：</h3>
              <div  v-for="(teacher, index) in teacherList" :key="teacher.id">
                <h4> {{teacher.TeacherName}} </h4>
              </div>
            </div>
          </div>
        </div>
    </section>
    <section class="content">
        <div class="row">

        </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'watchVideo',
  data () {
    return {
      vList: [],
      currentVideoIndex: 0,
      exam: '',
      site: '',
      startTime: '',
      endTime: '',
      studentName: '',
      studentList: [],
      teacherList: [],
      videoIndex: 0,
      hashChain: [],
      hashFile: [],
      result:["Success", "Fail"]
    }
  },
  mounted: function () {
    let _this = this;
    // this.vList = this.$globalVar.vList
    // this.studentList = this.$globalVar.studentList
    // this.teacherList = this.$globalVar.teacherList
    this.vList = JSON.parse(_this.$globalVar.getStorage("vUrlList"));
    console.log(this.vList)
    for (let v in this.vList){
      console.log(v);
      console.log(this.vList[v]);
      this.hashChain.push(this.vList[v].hashChain);
      this.hashFile.push(this.vList[v].hashFile);
    }
    this.vList.forEach(v => this.hashChain.push(v["hashChain"]));
    this.studentList = JSON.parse(_this.$globalVar.getStorage("vStudentList"));
    this.teacherList = JSON.parse(_this.$globalVar.getStorage("vTeacherList"));
    this.studentName = this.$globalVar.getStorage('studentName')
    this.exam = this.$globalVar.getStorage('exam')
    this.site = this.$globalVar.getStorage('site')
    this.startTime = this.$globalVar.getStorage('startTime')
    this.endTime = this.$globalVar.getStorage('endTime')
    this.initVideo();
  },
  computed : {
    current: function () {
      return this.currentVideoIndex;
    }
  },
  methods: {
    changeVideo(index) {
      let myPlayer = this.$video(myVideo, {
        controls: true,
        autoplay: 'muted',
        preload: 'auto',
        width: '800px',
      });
      var vList = this.vList;
      this.videoIndex = index;
      myPlayer.src(vList[index].url);
      myPlayer.load(vList[index].url);
      myPlayer.play();
    },
    initVideo () {
      // 初始化视频方法
      let _this = this;
      let myPlayer = this.$video(myVideo, {
        controls: true,
        autoplay: 'muted',
        preload: 'auto',
        width: '800px',
      });
      var vList = this.vList;
      var vLen = vList.length; // 播放列表的长度
      // var curr = this._currentVideoIndex; // 当前播放的视频
      var curr = 0;
      var isAllEnded = false;//所有视频是否都已播放完成（所有视频只播放一次）
      myPlayer.on("ended", play);
      let _this = this;
      play();
      function play(e) {
        if(isAllEnded){
          return false;
        }
        myPlayer.src(vList[curr].url);
        console.log(vList[curr].url);
        myPlayer.load(vList[curr].url);
        myPlayer.play();
        ++curr;
        ++_this.videoIndex;
        if(curr >= vLen){
          isAllEnded = true;
        }
      }
    }
  }
}

</script>

<style scoped>

</style>
