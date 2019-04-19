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
        <label>时间范围</label>

        <div class="input-group">
          <div class="input-group-addon">
            <i class="fa fa-clock-o"></i>
          </div>
          <input type="text" class="form-control pull-right" id="reservationtime" placeholder="11：00 5/12/2019 ~ 12：00 5/12/2019">
        </div>
        <!-- /.input group -->
      </div>
      <div class="form-group">
        <label>参与者</label>
      <div class="input-group">
        <span class="input-group-addon">@</span>
        <input type="text" class="form-control" placeholder="参与者">
      </div>
      </div>
      <div class="form-group">
        <label>考场号</label>
      <div class="input-group">
        <div class="input-group-addon">
          <i class="fa fa-location-arrow"></i>
        </div>
        <input type="text" class="form-control pull-right" id = "考场号">
      </div>
    </div>
      <div class="box-footer">
        <router-link to="/watch">
          <i class="fa fa-link"></i>
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
