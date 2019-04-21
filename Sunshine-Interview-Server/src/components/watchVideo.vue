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
            <h4>    考试：博雅计划面试</h4>
            <h4>    考场：文史楼101</h4>
            <h4>    时间：2019/06/20 8:30 - 9:00</h4>
            <h4>    参与者：胡三汉</h4>
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
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'watchVideo',
  data () {
    return {
      vList: ['http://video.chinanews.com/flv/gg/170918/1.mp4',
        'http://videoclips.chinanews.com/oss/onair/zxw/szuser/9d28c42f4e654ed2baffe606f0b9ef48_37.mp4',
        'http://video.chinanews.com/flv/2018/06/29/400/98482_web.mp4'],
      currentVideoIndex: 0
    }
  },
  mounted: function () {
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
      myPlayer.src(vList[index]);
      myPlayer.load(vList[index]);
      myPlayer.play();
    },
    initVideo () {
      // 初始化视频方法
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
      play();
      function play(e) {
        if(isAllEnded){
          return false;
        }
        myPlayer.src(vList[curr]);
        myPlayer.load(vList[curr]);
        myPlayer.play();
        ++curr;
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
