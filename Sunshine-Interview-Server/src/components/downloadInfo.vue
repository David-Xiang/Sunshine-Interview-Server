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
        <div style="text-align: center;">请下载<a href="../../static/validation.xlsx" download="validation.xlsx">所创建考试考场号及验证码</a></div>
      </div>
    </section>
    <!-- /.content -->
  </div>
</template>

<script>
export default {
  name: 'downloadInfo'
}
</script>

<style scoped>

</style>
