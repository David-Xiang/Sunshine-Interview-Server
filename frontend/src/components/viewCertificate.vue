<template>
  <div class="content">
    <section class="content-header">
      <h1>
        查看证书
        <small>View certificate</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#/"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li class="active">查看证书</li>
      </ol>
    </section>
    <!--section class="invoice"-->
      <!-- title row -->
      <div class="row">
        <div class="col-xs-12">
          <h2 class="page-header">
            <i class="fa fa-globe"></i> 阳光面试参试证书.
<!--            <small class="pull-right">Date: 2/10/2019</small>-->
          </h2>
        </div>
        <!-- /.col -->
      </div>
    <div class="col-lg-6 col-xs-6" id="certificate">
    <!--div id="certificate"-->
        <img src="../static/empty.jpg" style="width: auto; height: 800px;" id="background">
        <!--img src=imagePath style="width: auto; height: 100px; position: absolute;top: 150px; left: 400px;" id="img"-->
        <h4 id="name"> 姓 名：{{studentName}} </h4>
        <h4 id="id"> 考 号：{{studentID}} </h4>
        <h4 id="exam"> 考试名称：{{exam}} </h4>
        <h4 id="time"> 考试日期：{{startTime.substring(0,10)}} </h4>
        <h4 id="durance"> 考试时间：{{durance}} </h4>
        <h4 id="period"> 考试时长：{{min}}分{{sec}}秒 </h4>
        <h4 id="hash"> 上链哈希串： </h4>
        <h4 id="blockID1" style="font-family: consolas;">{{hashArray[0]}}</h4>
        <h4 id="blockID2" style="font-family: consolas;"> {{hashArray[1]}} </h4>
        <h4 id="blockID3" style="font-family: consolas;"> {{hashArray[2]}} </h4>
        <h5 id="foot0" class='foot' v-if="total > '3'"
            style="position: absolute;top: 610px;left: 60px;"> （共 {{total}} 项，显示前 3 项） </h5>
        <h5 id="foot1" class='foot' v-else-if="total === '3'"
            style="position: absolute;top: 610px;left: 60px;"> （共 3 项，显示 3 项） </h5>
        <h5 id="foot2" class='foot' v-else-if="total === '2'"
            style="position: absolute;top: 610px;left: 60px;"> （共 2 项，显示 2 项） </h5>
        <h5 id="foot3" class='foot' v-else
            style="position: absolute;top: 610px;left: 60px;"> （共 1 项，显示 1 项） </h5>
      </div>
      <div class="row no-print">
        <div class="col-xs-12">
<!--          <a href="invoice-print.html" target="_blank" class="btn btn-default"><i class="fa fa-print"></i> Print</a>-->
<!--          <button type="button" class="btn btn-success pull-right"><i class="fa fa-credit-card"></i> Submit Payment-->
<!--          </button>-->
          <button type="button" class="btn btn-primary pull-right" style="margin-right: 5px;" v-on:click="generatePdf()" >
            <i class="fa fa-download"></i> Generate PDF
          </button>
        </div>
      </div>
    <!--/section-->
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'viewCertificate',
    data () {
      return {
        studentName: '马冬梅',
        studentID: '',
        exam: '博雅计划面试',
        startTime: '2019/06/25',
        endTime: '',
        durance: '8:30 - 9:00',
        blockID1: '',
        blockID2: '',
        blockID3: '',
        userimg: require('../static/empty.png'),
        min: 0,
        sec: 0,
        total: -1,
        hashArray: [],
        //imagePath: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2967666897,3549949965&fm=15&gp=0.jpg'
      }
    },
    mounted: function () {
      this.hashArray = JSON.parse(this.$globalVar.getStorage("hashArray"));
      this.studentName = this.$globalVar.getStorage('studentName')
      this.studentID = this.$globalVar.getStorage('studentID')
      this.exam = this.$globalVar.getStorage('exam')
      this.startTime = this.$globalVar.getStorage('startTime')
      this.endTime = this.$globalVar.getStorage('endTime')
      let d = this.startTime.substr(11) + ' - ' + this.endTime.substr(11)
      this.durance = d
      // let rawIDLength = rawBlockID.length
      this.blockID1 = this.$globalVar.getStorage('blockID').substr(0, 16)
      this.blockID2 = this.$globalVar.getStorage('blockID').substr(16, 32)
      this.min = this.$globalVar.getStorage('min')
      this.sec = this.$globalVar.getStorage('sec')
      this.total = this.$globalVar.getStorage('total')
      // this.imagePath = this.$globalVar.getStorage('imgUrl')
      // document.getElementById("img").src = this.imagePath
      document.getElementById('name').style.position = 'absolute'
      document.getElementById('name').style.top = '200px'
      document.getElementById('name').style.left = '60px'
      document.getElementById('id').style.position = 'absolute'
      document.getElementById('id').style.top = '230px'
      document.getElementById('id').style.left = '60px'
      document.getElementById('exam').style.position = 'absolute'
      document.getElementById('exam').style.top = '310px'
      document.getElementById('exam').style.left = '60px'
      document.getElementById('time').style.position = 'absolute'
      document.getElementById('time').style.top = '340px'
      document.getElementById('time').style.left = '60px'
      document.getElementById('durance').style.position = 'absolute'
      document.getElementById('durance').style.top = '370px'
      document.getElementById('durance').style.left = '60px'
      document.getElementById('period').style.position = 'absolute'
      document.getElementById('period').style.top = '400px'
      document.getElementById('period').style.left = '60px'
      document.getElementById('hash').style.position = 'absolute'
      document.getElementById('hash').style.top = '480px'
      document.getElementById('hash').style.left = '60px'
      document.getElementById('blockID1').style.position = 'absolute'
      document.getElementById('blockID1').style.top = '515px'
      document.getElementById('blockID1').style.left = '100px'
      document.getElementById('blockID2').style.position = 'absolute'
      document.getElementById('blockID2').style.top = '545px'
      document.getElementById('blockID2').style.left = '100px'
      document.getElementById('blockID3').style.position = 'absolute'
      document.getElementById('blockID3').style.top = '575px'
      document.getElementById('blockID3').style.left = '100px'
    }
  }
</script>

<style scoped>

</style>
