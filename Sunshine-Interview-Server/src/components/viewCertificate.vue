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
    <section class="invoice">
      <!-- title row -->
      <div class="row">
        <div class="col-xs-12">
          <h2 class="page-header">
            <i class="fa fa-globe"></i> 阳光面试参试证书.
            <small class="pull-right">Date: 2/10/2014</small>
          </h2>
        </div>
        <!-- /.col -->
      </div>
      <div class="col-lg-6 col-xs-6" id="certificate">
        <img src="../static/certificate.jpg" style="width: auto; height: 800px;" id="background">
        <h3 id="name"> {{studentName}} </h3>
        <h3 id="exam"> {{exam}} </h3>
        <h3 id="time"> {{StartTime}} </h3>
        <h3 id="durance"> {{EndTime}} </h3>
        <h3 id="blockID"> {{blockID}} </h3>
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
    </section>
  </div>
</template>

<script>
export default {
  name: 'viewCertificate',
  data () {
    return {
      studentName: '马冬梅',
      exam: '博雅计划面试',
      StartTime: '2019/06/25',
      EndTime: '8:30 - 9:00',
      blockID: '00101101',
      userimg: require('../static/certificate.jpg')
    }
  },
  mounted: function () {
    this.studentName = this.$globalVar.getStorage('studentName')
    this.exam = this.$globalVar.getStorage('exam')
    this.StartTime = this.$globalVar.getStorage('StartTime')
    this.EndTime = this.$globalVar.getStorage('EndTime')
    this.blockID = this.$globalVar.getStorage('blockID')
    document.getElementById('name').style.position = 'absolute'
    document.getElementById('name').style.top = '260px'
    document.getElementById('name').style.left = '330px'
    document.getElementById('exam').style.position = 'absolute'
    document.getElementById('exam').style.top = '395px'
    document.getElementById('exam').style.left = '280px'
    document.getElementById('time').style.position = 'absolute'
    document.getElementById('time').style.top = '443px'
    document.getElementById('time').style.left = '280px'
    document.getElementById('durance').style.position = 'absolute'
    document.getElementById('durance').style.top = '490px'
    document.getElementById('durance').style.left = '280px'
    document.getElementById('blockID').style.position = 'absolute'
    document.getElementById('blockID').style.top = '530px'
    document.getElementById('blockID').style.left = '280px'
  }
}
</script>

<style scoped>

</style>
