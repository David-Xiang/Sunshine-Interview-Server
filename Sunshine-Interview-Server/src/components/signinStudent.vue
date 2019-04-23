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
            <input v-on:keyup.enter="signin" v-model="username" type="number" class="form-control" placeholder="用户名">
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input v-on:keyup.enter="signin" v-model="password" type="password" class="form-control" placeholder="密码">
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
              <button v-on:click="signin" type="button" class="btn btn-danger btn-block btn-flat" style="position: center; width: auto" @click="signin">登录</button>
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
  name: 'signinStudent',
  data() {
    return {
      username : "",
      password : "",
      //collegeID : 0
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
      $.ajax({
        url: "/apis/login",
        type: "get",
        data: {username: _this.username, password: _this.password},
        async: true,
        success: function (data, stats) {

          // data (type: JSONstring) like:{
          //    permitted: true
          //    collegeID: int
          // }
          data = JSON.parse(data);
          console.log("receive request:", data);
          if (data.permitted === false){
            alert("密码或账号有误，请重试");
            _this.password = '';
            _this.username = '';
            return;
          }

          // _this.collegeID = data.collegeID;
          // _this.emit(data.collegeID);
          _this.$globalVar.setCollegeID(data.CollegeID);
          _this.$router.replace('/view');
        },
        error: function () {
          alert("网络请求错误，请重试！");
        }
      });
    },

    emit: function (data) {
      console.log("in Signin, sendID", data);
      eventBus.$emit('sendcollegeID', data);
    }
  }
}
</script>

<style scoped>

</style>
