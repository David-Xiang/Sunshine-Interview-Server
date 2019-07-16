<template>
  <div class="content body">
    <section class="content-header">
      <h1>
        请选择服务
        <small>选择登录入口</small>
      </h1>
<!--      <ol class="breadcrumb">-->
<!--        <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>-->
<!--        <li class="active">Widgets</li>-->
<!--      </ol>-->
    </section>
    <section class="content">
      <div class="row">
        <div class="col-lg-4 col-xs-6">
          <!-- small box -->
          <div class="small-box bg-aqua">
            <div class="inner">
              <h4>设置考试信息</h4>

              <p>教务入口</p>
            </div>
            <div class="icon">
              <i class="ion ion-bag"></i>
              <span class="glyphicon glyphicon-th-list"></span>
            </div>
                <router-link to="/signinTeacher" class="small-box-footer">点击登录 <i class="fa fa-arrow-circle-right"></i></router-link>

          </div>
        </div>
        <!-- ./col -->
        <div class="col-lg-4 col-xs-6">
          <!-- small box -->
          <div class="small-box bg-green">
            <div class="inner">
              <h4>查看证书</h4>

              <p>考生入口</p>
            </div>
            <div class="icon">
              <i class="ion ion-stats-bars"></i>
              <span class="glyphicon glyphicon-file"></span>
            </div>
            <router-link to="/signinStudent" class="small-box-footer">点击登录 <i class="fa fa-arrow-circle-right"></i></router-link>
          </div>
        </div>
        <!-- ./col -->
        <div class="col-lg-4 col-xs-6">
          <!-- small box -->
          <div class="small-box bg-red">
            <div class="inner">
              <h4>查看视频</h4>

              <p>高校及教育部入口</p>
            </div>
            <div class="icon">
              <i class="ion ion-pie-graph"></i>
              <span class="glyphicon glyphicon-search"></span>
            </div>
            <router-link to="/signinSchool" class="small-box-footer">点击登录 <i class="fa fa-arrow-circle-right"></i></router-link>
          </div>
        </div>
        <!-- ./col -->
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'chooseFunction'
}
</script>

<style scoped>

</style>
