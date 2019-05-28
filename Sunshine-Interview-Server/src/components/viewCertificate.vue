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
            <small class="pull-right">Date: 2/10/2019</small>
          </h2>
        </div>
        <!-- /.col -->
      </div>
      <div class="col-lg-12 col-xs-12" id="certificate">
    <!--div id="certificate"-->
        <img src="../static/certificate.jpg" style="width: auto; height: 800px;" id="background">
        <h3 id="name"> {{studentName}} </h3>
        <h3 id="exam"> {{exam}} </h3>
        <h3 id="time"> {{startTime}} </h3>
        <h3 id="durance"> {{durance}} </h3>
        <h4 id="blockID1"> {{blockID1}} </h4>
        <h4 id="blockID2"> {{blockID2}} </h4>
      </div>
      <div class="row no-print">
        <div class="col-xs-12">
          <a href="invoice-print.html" target="_blank" class="btn btn-default"><i class="fa fa-print"></i> Print</a>
          <button type="button" class="btn btn-success pull-right"><i class="fa fa-credit-card"></i> Submit Payment
          </button>
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
        exam: '博雅计划面试',
        startTime: '2019/06/25',
        endTime: '',
        durance: '8:30 - 9:00',
        blockID1: '00101101',
        blockID2: '00101101',
        userimg: require('../static/certificate.jpg')
      }
    },
    mounted: function () {
      this.studentName = this.$globalVar.getStorage('studentName')
      this.exam = this.$globalVar.getStorage('exam')
      this.startTime = this.$globalVar.getStorage('startTime')
      this.endTime = this.$globalVar.getStorage('endTime')
      let d = this.startTime.substr(11) + ' - ' + this.endTime.substr(11)
      this.durance = d
      // let rawIDLength = rawBlockID.length
      this.blockID1 = this.$globalVar.getStorage('blockID').substr(0, 16)
      this.blockID2 = this.$globalVar.getStorage('blockID').substr(16, 32)
      document.getElementById('name').style.position = 'absolute'
      document.getElementById('name').style.top = '260px'
      document.getElementById('name').style.left = '330px'
      document.getElementById('exam').style.position = 'absolute'
      document.getElementById('exam').style.top = '395px'
      document.getElementById('exam').style.left = '270px'
      document.getElementById('time').style.position = 'absolute'
      document.getElementById('time').style.top = '443px'
      document.getElementById('time').style.left = '270px'
      document.getElementById('durance').style.position = 'absolute'
      document.getElementById('durance').style.top = '490px'
      document.getElementById('durance').style.left = '270px'
      document.getElementById('blockID1').style.position = 'absolute'
      document.getElementById('blockID1').style.top = '545px'
      document.getElementById('blockID1').style.left = '270px'
      document.getElementById('blockID2').style.position = 'absolute'
      document.getElementById('blockID2').style.top = '575px'
      document.getElementById('blockID2').style.left = '270px'
    }
  }
</script>

<style scoped>

</style>
