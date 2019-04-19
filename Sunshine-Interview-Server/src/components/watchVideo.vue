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
        <div class="col-lg-3 col-xs-6"></div>
        <div class="col-lg-4 col-xs-6 bg-red">
          <div class="inner">
          <span class="info-box-icon"><i class="fa fa-bookmark-o"></i></span>
          <div class="info-box-content">
        <h4>    考试：博雅计划面试</h4>
        <h4>    考场：文史楼101</h4>
        <h4>    时间：2019/06/20 8:30 - 9:00</h4>
        <h4>    参与者：胡三汉</h4>
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
    return {}
  },
  mounted () {
    this.initVideo()
  },
  methods: {
    initVideo () {
      // 初始化视频方法
      let myPlayer = this.$video(myVideo, {
        // 确定播放器是否具有用户可以与之交互的控件。
        // 没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: true,
        // 自动播放属性,muted:静音播放
        autoplay: 'muted',
        // 建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: 'auto',
        // 设置视频播放器的显示宽度（以像素为单位）
        width: '800px',
        // 设置视频播放器的显示高度（以像素为单位）
        height: '400px'
      })
    }
  }
}
</script>

<style scoped>

</style>
