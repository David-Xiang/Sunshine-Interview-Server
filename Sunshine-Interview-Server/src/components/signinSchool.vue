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
            <input v-on:keyup.enter="signin" type="number" v-model="username" class="form-control" placeholder="用户名">
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input v-on:keyup.enter="signin" type="password" v-model="password" class="form-control" placeholder="密码">
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
              <button type="button" class="btn btn-danger btn-block btn-flat" style="position: center; width: auto">登录</button>
            </div>
            <!-- /.col -->
          </div>

<!--        <a href="#">忘记密码</a><br>-->
        <router-link to="/contact"><span>忘记密码</span></router-link><br>
        <router-link to="/contact"><span>注册新账号</span></router-link>

      </div>
      <!-- /.login-box-body -->
    </div>
  </div>

</template>

<!--script src="http://code.jquery.com/jquery-latest.js"></script-->
<script>
/* eslint-disable */
import { JSEncrypt } from 'jsencrypt'
export default {
  name: 'signinSchool',
  data() {
    return {
      username : "",
      password : "",
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
      let _this = this;
      let encryptor = new JSEncrypt();
      let secretKey = "SunshineInterview";
      $.ajax({
        url: "/apis/login",
        type: "get",
        data: {
          username: _this.username,
          password: encryptor.encrypt(_this.password, secretKey, 256),
          /*
          * nodejs端解密方法:
          * let encryptor = require('encryptjs');
          * secretKey = "SunshineInterview";
          * let decipher = encryptor.decrypt(cipherText,secretkey,256);
           */
          // password: _this.password,
          loginState: "school"
        },
        async: true,
        success: function (data, stats) {

          // data (type: JSONstring) like:{
          //    permitted: true
          //    CollegeID: int
          // }
          data = JSON.parse(data);
          console.log("receive request:", data);
          if (!data.hasOwnProperty("permitted") || !data.hasOwnProperty("CollegeID") || data.permitted === false){
            alert("密码或账号有误，请重试");
            _this.password = '';
            _this.username = '';
            return;
          }

          _this.$globalVar.setCollegeID(data.CollegeID);
          _this.$globalVar.setStorage(
            {
              "collegeID": data.CollegeID,
              "loginState": "school",
            }
          );
          document.getElementById("identification").innerHTML="欢迎您，" + _this.$globalVar.collegeID;
          document.getElementById("status").innerHTML=_this.$globalVar.getStorage("loginStatus");
          document.getElementById("statusLight").setAttribute("class", "fa fa-circle text-success");
          _this.$router.replace('/search');
        },
        error: function () {
          alert("网络请求错误，请重试！");
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
