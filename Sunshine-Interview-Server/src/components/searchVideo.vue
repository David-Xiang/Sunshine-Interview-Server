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
        <input type="number" class="form-control" placeholder="请填写学校编码">
      </div>
    </div>
      <div class="form-group">
        <label>参与者id</label>
        <div class="input-group">
          <span class="input-group-addon">@</span>
          <input type="number" class="form-control" placeholder="请填写考官或考生id">
        </div>
      </div>
      <div class="box-footer">
        <router-link to="/watch">
          <button type="submit" class="btn btn-danger">查询</button>
        </router-link>
      </div>
    <!-- /.box-body -->
  </div>
  </div>
  </section>
</div>
</template>

<script>
export default {
  name: 'searchVideo'
}
</script>

<style scoped>

</style>
