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
            <input v-on:keyup.enter="signin" v-model="name" type="text" class="form-control" placeholder="姓名">
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input v-on:keyup.enter="signin" v-model="id" type="number" class="form-control" placeholder="准考证号">
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
              <button type="button" class="btn btn-danger btn-block btn-flat" style="position: center; width: auto" @click="signin">登录</button>
            </div>
            <!-- /.col -->
          </div>

        <router-link to="/contact"><span>忘记密码</span></router-link><br>
        <router-link to="/contact"><span>注册新账号</span></router-link>

      </div>
      <!-- /.login-box-body -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { JSEncrypt } from 'jsencrypt'
export default {
  name: 'signinStudent',
  data() {
    return {
      name : "",
      id : "",
      exam: '',
      time: '',
      blockID: ''
    }
  },
  watch: {
    name: function (nValue, oValue) {
      console.log("username changed")
    },
    id: function (nValue, oValue) {
      console.log("passwprd changed")
    }
  },
  methods: {
    signin () {
      let _this = this;
      let encryptor = new JSEncrypt();
      let secretKey = "SunshineInterview";
      console.log("before encrypt:", _this.id);
      console.log("after encrypt", encryptor.encrypt(_this.id, secretKey, 256));
      $.ajax({
        url: "/apis/login",
        type: "get",
        data: {
          username: _this.name,
          password: encryptor.encrypt(_this.id, secretKey, 256),
          //password: _this.password,
          loginState: "student"
        },
        async: true,
        success: function (data, stats) {

          // data (type: JSONstring) like:{
          //    permitted: true
          //    collegeID: int
          // }
          data = JSON.parse(data);
          console.log("receive request:", data);
          if (!data.hasOwnProperty("permitted") || !data.hasOwnProperty("CollegeID") || data.permitted === false){
            alert("密码或账号有误，请重试");
            _this.password = '';
            _this.username = '';
            return;
          }

          // _this.collegeID = data.collegeID;
          // _this.emit(data.collegeID);
          _this.$globalVar.setCollegeID(data.CollegeID);
          _this.$globalVar.setStudentName(data.name);
          _this.$globalVar.setExam(data.exam);
          _this.$globalVar.setTime(data.time);
          _this.$globalVar.setBlockID(data.blockID);
          _this.$globalVar.setStorage(
            {
              "collegeID": data.CollegeID,
              "loginState": "student",
              "studentName": data.name,
              "exam": data.exam,
              "time": data.time,
              'blockID': data.blockID
            }
          );
          document.getElementById("identification").innerHTML="欢迎您，" + _this.$globalVar.studentName;
          document.getElementById("status").innerHTML=_this.$globalVar.getStorage("loginStatus");
          document.getElementById("statusLight").setAttribute("class", "fa fa-circle text-success");
          _this.$router.replace('/view');
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
