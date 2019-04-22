<template>
  <div class="content body">
    <div class="login-box" style="height: auto">
      <div class="login-logo">
        <a href="../../index.html"><b>阳光考试系统</b>BETA</a>
      </div>
      <!-- /.login-logo -->
      <div class="login-box-body">
        <p class="login-box-msg">高校及教育部入口</p>

          <div class="form-group has-feedback">
            <input type="number" v-model="username" class="form-control" placeholder="用户名">
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input type="password" v-model="password" class="form-control" placeholder="密码">
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
              <a href="javascript:void(0);" class="btn btn-danger btn-block btn-flat" style="position: center; width: auto" v-on:click="signin">登录</a>
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

<!--script src="http://code.jquery.com/jquery-latest.js"></script-->
<script>
/* eslint-disable */
import * as axios from 'axios'
export default {
  name: 'signinSchool',
  data() {
    return {
      username : "",
      password : ""
    }
  },
  watch: {
    username: function (nValue, oValue) {
      console.log("username changed")
    },
    password: function (nValue, oValue) {
      console.log("passwprd changed")
    }
  },
  methods: {
    signin () {
      $.ajax({
        url: "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&ch=&tn=baiduerr&bar=&wd=pku",
        type: "get",
        data: {username: this.username, password: this.password},
        async: true,
        success: function (data, stats) {
          console.log(data);
          this.$router.replace('/search');
        },
        error: function () {
          alert("网络请求错误，请重试！");
        }
      }).then(function (res) {
        console.log(res);
      });
    }
  }
}
</script>

<style scoped>

</style>
