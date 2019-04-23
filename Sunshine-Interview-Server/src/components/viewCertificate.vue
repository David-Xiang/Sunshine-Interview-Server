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
            <i class="fa fa-globe"></i> 证书信息
<!--            <small class="pull-right">Date: 2/10/2014</small>-->
          </h2>
        </div>
        <!-- /.col -->
      </div>
      <!-- info row -->
      <div class="row invoice-info">
        <!-- /.col -->
        <div class="col-sm-4 invoice-col">
          <b>考生姓名：</b>{{studentName}}<br>
          <b>考试名称：</b> {{interviewName}}<br>
          <b>考试时间：</b> {{interviewTime}}<br>
          <b>区块链号：</b> {{blockId}}
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <!-- /.row -->
      <!-- this row will not appear when printing -->
      <div class="row no-print">
        <div class="col-xs-12">
          <button type="button" class="btn btn-primary pull-right" style="margin-right: 5px;" v-on:click="generatePdf(background)" >
            <i class="fa fa-download"></i> 下载证书
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'viewCertificate',
  data: function () {
    return {
      // TODO
      studentName: '何炬',
      interviewName: '软件工程期中考试',
      interviewTime: '2019-06-06',
      blockId: '05048972'
    }
  }
}
</script>

<style scoped>

</style>
