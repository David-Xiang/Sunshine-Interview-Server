<template>
  <div class="content body">
    <div class="login-box" style="height: auto">
      <div class="login-logo">
        <a href="../../index.html"><b>阳光考试系统</b>BETA</a>
      </div>
      <!-- /.login-logo -->
      <div class="login-box-body">
        <p class="login-box-msg">考生入口</p>

          <div class="form-group has-feedback">
            <input type="number" class="form-control" placeholder="用户名">
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="密码">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="row">
            <div class="col-xs-8">
              <div class="checkbox icheck">
                <label>
                  <div class="icheckbox_square-blue" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" style="position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> Remember Me
                </label>
              </div>
            </div>
            <!-- /.col -->
            <div class="col-xs-4">
              <button class="btn btn-danger btn-block btn-flat" style="position: center; width: auto">登录</button>
            </div>
            <!-- /.col -->
          </div>

        <a href="#">忘记密码</a><br>
        <a href="#" class="text-center">注册新账号</a>

      </div>
      <!-- /.login-box-body -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'signinTeacher'
}
</script>

<style scoped>

</style>
