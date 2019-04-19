<template>
<div class="wrapper">
  <!-- Main Header -->
  <header class="main-header">

    <!-- Logo -->
    <a href="index2.html" class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>A</b>LT</span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><b>Admin</b>LTE</span>
    </a>

    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>
      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- Messages: style can be found in dropdown.less-->
          <li class="dropdown messages-menu">
            <!-- Menu toggle button -->
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <i class="fa fa-envelope-o"></i>
              <span class="label label-success">4</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">You have 4 messages</li>
              <li>
                <!-- inner menu: contains the messages -->
                <ul class="menu">
                  <li><!-- start message -->
                    <a href="#">
                      <div class="pull-left">
                        <!-- User Image -->
                        <img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">
                      </div>
                      <!-- Message title and timestamp -->
                      <h4>
                        Support Team
                        <small><i class="fa fa-clock-o"></i> 5 mins</small>
                      </h4>
                      <!-- The message -->
                      <p>Why not buy a new awesome theme?</p>
                    </a>
                  </li>
                  <!-- end message -->
                </ul>
                <!-- /.menu -->
              </li>
              <li class="footer"><a href="#">See All Messages</a></li>
            </ul>
          </li>
          <!-- /.messages-menu -->

          <!-- Notifications Menu -->
          <li class="dropdown notifications-menu">
            <!-- Menu toggle button -->
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <i class="fa fa-bell-o"></i>
              <span class="label label-warning">10</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">You have 10 notifications</li>
              <li>
                <!-- Inner Menu: contains the notifications -->
                <ul class="menu">
                  <li><!-- start notification -->
                    <a href="#">
                      <i class="fa fa-users text-aqua"></i> 5 new members joined today
                    </a>
                  </li>
                  <!-- end notification -->
                </ul>
              </li>
              <li class="footer"><a href="#">View all</a></li>
            </ul>
          </li>
          <!-- Tasks Menu -->
          <li class="dropdown tasks-menu">
            <!-- Menu Toggle Button -->
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <i class="fa fa-flag-o"></i>
              <span class="label label-danger">9</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">You have 9 tasks</li>
              <li>
                <!-- Inner menu: contains the tasks -->
                <ul class="menu">
                  <li><!-- Task item -->
                    <a href="#">
                      <!-- Task title and progress text -->
                      <h3>
                        Design some buttons
                        <small class="pull-right">20%</small>
                      </h3>
                      <!-- The progress bar -->
                      <div class="progress xs">
                        <!-- Change the css width attribute to simulate progress -->
                        <div class="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar"
                             aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                          <span class="sr-only">20% Complete</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <!-- end task item -->
                </ul>
              </li>
              <li class="footer">
                <a href="#">View all tasks</a>
              </li>
            </ul>
          </li>
          <!-- User Account Menu -->
          <li class="dropdown user user-menu">
            <!-- Menu Toggle Button -->
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <!-- The user image in the navbar-->
              <img src="dist/img/user2-160x160.jpg" class="user-image" alt="User Image">
              <!-- hidden-xs hides the username on small devices so only the image appears. -->
              <span class="hidden-xs">Alexander Pierce</span>
            </a>
            <ul class="dropdown-menu">
              <!-- The user image in the menu -->
              <li class="user-header">
                <img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">

                <p>
                  Alexander Pierce - Web Developer
                  <small>Member since Nov. 2012</small>
                </p>
              </li>
              <!-- Menu Body -->
              <li class="user-body">
                <div class="row">
                  <div class="col-xs-4 text-center">
                    <a href="#">Followers</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a href="#">Sales</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a href="#">Friends</a>
                  </div>
                </div>
                <!-- /.row -->
              </li>
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <a href="#" class="btn btn-default btn-flat">Profile</a>
                </div>
                <div class="pull-right">
                  <a href="#" class="btn btn-default btn-flat">Sign out</a>
                </div>
              </li>
            </ul>
          </li>
          <!-- Control Sidebar Toggle Button -->
          <li>
            <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <!-- Left side column. contains the logo and sidebar -->
  <aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

      <!-- Sidebar user panel (optional) -->
      <div class="user-panel">
        <div class="pull-left image">
          <img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>Alexander Pierce</p>
          <!-- Status -->
          <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
        </div>
      </div>

      <!-- search form (Optional) -->
      <form action="#" method="get" class="sidebar-form">
        <div class="input-group">
          <input type="text" name="q" class="form-control" placeholder="Search...">
          <span class="input-group-btn">
              <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
              </button>
            </span>
        </div>
      </form>
      <!-- /.search form -->

      <!-- Sidebar Menu -->
      <ul class="sidebar-menu" data-widget="tree">
        <li class="header">HEADER</li>
        <!-- Optionally, you can add icons to the links -->
        <li class="active"><a href="#"><i class="fa fa-link"></i> <span>Link</span></a></li>
        <li><a href="#"><i class="fa fa-link"></i> <span>Another Link</span></a></li>
        <li class="treeview">
          <a href="#"><i class="fa fa-link"></i> <span>Multilevel</span>
            <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
          </a>
          <ul class="treeview-menu">
            <li><a href="#">Link in level 2</a></li>
            <li><a href="#">Link in level 2</a></li>
          </ul>
        </li>
      </ul>
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        Page Header
        <small>Optional description</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Level</a></li>
        <li class="active">Here</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content container-fluid">

      <!--------------------------
        | Your Page Content Here |x
        -------------------------->
        <input type="file" v-on:change="impt(this)" />
        <input type="button" value="下载" v-on:click="down()" />
        <input type="button" value="查看结果数据数据" v-on:click="showData()" />
        <div id="hot"></div>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  <footer class="main-footer">
    <!-- To the right -->
    <div class="pull-right hidden-xs">
      Anything you want
    </div>
    <!-- Default to the left -->
    <strong>Copyright &copy; 2016 <a href="#">Company</a>.</strong> All rights reserved.
  </footer>

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Create the tabs -->
    <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
      <li class="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>
      <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>
    </ul>
    <!-- Tab panes -->
    <div class="tab-content">
      <!-- Home tab content -->
      <div class="tab-pane active" id="control-sidebar-home-tab">
        <h3 class="control-sidebar-heading">Recent Activity</h3>
        <ul class="control-sidebar-menu">
          <li>
            <a href="javascript:">
              <i class="menu-icon fa fa-birthday-cake bg-red"></i>

              <div class="menu-info">
                <h4 class="control-sidebar-subheading">Langdon's Birthday</h4>

                <p>Will be 23 on April 24th</p>
              </div>
            </a>
          </li>
        </ul>
        <!-- /.control-sidebar-menu -->

        <h3 class="control-sidebar-heading">Tasks Progress</h3>
        <ul class="control-sidebar-menu">
          <li>
            <a href="javascript:">
              <h4 class="control-sidebar-subheading">
                Custom Template Design
                <span class="pull-right-container">
                    <span class="label label-danger pull-right">70%</span>
                  </span>
              </h4>

              <div class="progress progress-xxs">
                <div class="progress-bar progress-bar-danger" style="width: 70%"></div>
              </div>
            </a>
          </li>
        </ul>
        <!-- /.control-sidebar-menu -->

      </div>
      <!-- /.tab-pane -->
      <!-- Stats tab content -->
      <div class="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
      <!-- /.tab-pane -->
      <!-- Settings tab content -->
      <div class="tab-pane" id="control-sidebar-settings-tab">
        <form method="post">
          <h3 class="control-sidebar-heading">General Settings</h3>

          <div class="form-group">
            <label class="control-sidebar-subheading">
              Report panel usage
              <input type="checkbox" class="pull-right" checked>
            </label>

            <p>
              Some information about this general settings option
            </p>
          </div>
          <!-- /.form-group -->
        </form>
      </div>
      <!-- /.tab-pane -->
    </div>
  </aside>
  <!-- /.control-sidebar -->
  <!-- Add the sidebar's background. This div must be placed
  immediately after the control sidebar -->
  <div class="control-sidebar-bg"></div>
</div>
</template>

<script>
import Handsontable from 'handsontable'
import XLSX from 'xlsx'

export default {
  name: 'starter',
  mounted: function () {
    this.doit()
  },
  data: function () {
    return {
      xHred: {
      // "地点": "id",
      // "账号": "uname",
      // "用户名": "rname",
      // "密码": "pwd",
      // "性别": "sex",
      // "出生日期": "birth",
      // "电话": "mobPhone"
        '地点': 'siteName',
        '开始时间': 'startTime',
        '结束时间': 'endTime',
        '准考证号': 'studentID',
        '姓名': 'studentName',
        '邮箱': 'eMail',
        '电话': 'mobPhone'
      },
      utl: {},
      hot: []
    }
  },
  methods: {
    doit () {
      this.utl.Binary = {
        fixdata (data) { // 文件流转BinaryString
          var o = ''
          var l = 0
          var w = 10240
          for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
          return o
        },
        s2ab (s) { // 字符串转字符流
          var buf = new ArrayBuffer(s.length)
          var view = new Uint8Array(buf)
          for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
          return buf
        }
      }
      this.utl.XLSX = {
        wb: null,
        rABS: false,
        import (f, c) { // 导入根据文件
          this.wb = null
          var reader = new FileReader()
          reader.onload = function (e) {
            var data = e.target.result
            if (this.utl.XLSX.rABS) {
              this.utl.XLSX.wb = XLSX.read(btoa(this.utl.Binary.fixdata(data)), {// 手动转化
                type: 'base64'
              })
            } else {
              this.utl.XLSX.wb = XLSX.read(data, {
                type: 'binary'
              })
            }
            if (c && typeof (c)) {
              c()
            }
          }
          if (this.utl.XLSX.rABS) {
            reader.readAsArrayBuffer(f)
          } else {
            reader.readAsBinaryString(f)
          }
        },
        onImport (obj, c) { // 导入根据 input file标签
          if (!obj.files) {
            return
          }
          this.import(obj.files[0], c)
        },
        getSheetsByIndex (index = 0) { // 获取数据根据Sheets索引
          return XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[index]])
        },
        getCharCol (n) {
          // let temCol = ''
          let s = ''
          let m = 0
          while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
          }
          return s
        },
        export (json, title, type) { // 导出
          var keyMap = []// 获取keys
          for (var k in json[0]) {
            keyMap.push(k)
          }
          var tmpdata = []// 用来保存转换好的json
          json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
            v: v[k],
            position: (j > 25 ? this.utl.XLSX.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
          }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => {
            tmpdata[v.position] = {
              v: v.v
            }
            return v.v
          })
          var outputPos = Object.keys(tmpdata) // 设置区域,比如表格从A1到D10
          var tmpWB = {}
          title = title || 'mySheet'
          tmpWB.SheetNames = [title]
          tmpWB.Sheets = {}
          tmpWB.Sheets[title] = Object.assign({}, tmpdata, // 内容
            {
              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
            })
          return new Blob([this.utl.Binary.s2ab(XLSX.write(tmpWB,
            { bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }// 这里的数据是用来定义导出的格式类型
          ))], { type: '' }) // 创建二进制对象写入转换好的字节流
        },
        onExport (json, title, type) { // 直接下载
          this.utl.Download.byObj(this.export(json, title, type), '下载.xlsx')
        }
      }
      this.utl.Download = {
        byURL (url, fileName) { // 动态下载
          var tmpa = document.createElement('a')
          tmpa.download = fileName || '下载'
          tmpa.href = url // 绑定a标签
          tmpa.click() // 模拟点击实现下载
        },
        byObj (obj, fileName) { // 内存二进制数据下载
          this.byURL(URL.createObjectURL(obj), fileName)
          setTimeout(function () { // 延时释放
            URL.revokeObjectURL(obj) // 用URL.revokeObjectURL()来释放这个object URL
          }, 100)
        }
      }
      this.utl.Object = {
        reverse (obj) { // 对象键值倒转
          var o = {}
          for (var k in obj) {
            o[obj[k]] = k
          }
          return o
        },
        // deepCopy () { // 深拷贝
        //   let temp = obj.constructor === Array ? [] : {}
        //   for (let val in obj) {
        //     temp[val] = typeof obj[val] === 'object' ? deepCopy(obj[val]) : obj[val]
        //   }
        //   return temp
        // },
        copyJson (o) { return JSON.parse(JSON.stringify(o)) }// 拷贝JSON格式
      }
      var hotElement = document.querySelector('#hot')// <====绑定handsontable初始化div
      var colHeaders = []// <===handsontable列头显示值
      var cols = []// <====handsontable列头显示值对应的实际字段与其他配置
      for (var key in this.xHred) {
        cols.push({ data: this.xHred[key] })
        colHeaders.push(key)
      }
      var hotSettings = {// <====handsontable的配置
        colHeaders: colHeaders, // 当值为true时显示列头，当值为数组时，列头为数组的值
        data: [], // 数据源
        columns: cols, // 列具体配置
        // width: 906,
        autoWrapRow: true,
        // height: 641,
        // maxRows: 22,
        minRows: 1,
        // currentRowClassName：当前行样式的名称,
        // currentColClassName：当前列样式的名称,
        manualColumnResize: true, // 当值为true时，允许拖动，当为false时禁止拖动
        manualRowResize: true, // 当值为true时，允许拖动，当为false时禁止拖动
        stretchH: 'all', // last:延伸最后一列,all:延伸所有列,none默认不延伸。
        manualColumnMove: true, // 当值为true时，列可拖拽移动到指定列
        manualRowMove: true, // 当值为true时，行可拖拽至指定行
        rowHeaders: true, // 当值为true时显示行头，当值为数组时，行头为数组的值
        columnSorting: true, // 允许排序
        sortIndicator: true,
        contextMenu: true, // 显示右键菜单
        autoColumnSize: true // 当值为true且列宽未设置时，自适应列大小
      }
      this.hot = new Handsontable(hotElement, hotSettings)
    },
    impt (emt) {
      this.utl.XLSX.onImport(emt, function () {
        var rt = this.utl.XLSX.getSheetsByIndex() // <===默认获取Sheet1
        var tmp = []
        rt.forEach(function (value, index, array) {
          var t = {}
          for (var k in value) {
            t[this.xHred[k]] = value[k]
          }
          tmp.push(t)
        })
        this.hot.loadData(tmp) // <====将读取完成数据显示到handsontable
      })
    },
    down () { // <===下载导出数据
      var d = this.utl.Object.copyJson(this.hot.getSourceData()) // <=====读取handsontable的数据
      d.unshift(this.utl.Object.reverse(this.xHred)) // <====追加到列头
      this.utl.XLSX.onExport(d) // <====导出
    },
    showData () { // <====获取真实数据
      var tmp = []
      this.hot.getSourceData().forEach(function (value, index, array) {
        var t = {}
        for (var k in value) {
          // t[k] = filterVal[k] ? filterVal[k](value[k]) : value[k];//<====将xlsx数据转为实际需要的值
          t[k] = value[k]
        }
        tmp.push(t)
      })
      /*
      *更多规则自己定义吧
      */
      alert(JSON.stringify(tmp))
      window.open('data:text/html;charset=utf-8,' + JSON.stringify(tmp))
      console.log(tmp)
      return tmp
    }
  }
}

</script>

<style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
            overflow: auto;
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
        }
</style>
