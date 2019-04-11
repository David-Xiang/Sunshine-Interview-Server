<template>
  <div class="content" style="min-height: 1170px;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        新建考试
        <small>New exam</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li><a href="#">设置考试信息</a></li>
        <li class="active">新建考试</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content">

      <!-- Default box -->
      <div class="box box-danger">
        <div class="box-header with-border">
          <h3 class="box-title">考试相关信息</h3>
        </div>
        <!-- /.box-header -->
        <!-- form start -->
        <form role="form">
          <div class="box-body">
            <div class="form-group">
              <label for="examName">考试名称</label>
              <input type="text" class="form-control" id="examName" placeholder="请输入考试名称">
            </div>
            <div class="form-group">
              <label>下载考生信息模板</label>
              <a href="../../static/studentInput1.xlsx" download="studentInput1.xlsx.xlsx">下载</a>
            </div>
            <div class="form-group">
              <label>下载考官信息模板</label>
              <a href="../../static/teacherInput1.xlsx.xlsx" download="teacherInput1.xlsx">下载</a>
            </div>
            <div class="form-group">
              <label for="exampleInputFile">上传考生信息</label>
              <input type="file" id="exampleInputFile">

              <p class="help-block">请勿修改表格格式</p>
            </div>
            <div class="form-group">
              <label for="exampleInputFile1">上传考官信息</label>
              <input type="file" id="exampleInputFile1">

              <p class="help-block">请勿修改表格格式</p>
            </div>
          </div>
          <!-- /.box-body -->

          <div class="box-footer">
            <button type="submit" class="btn btn-danger">提交</button>
          </div>
        </form>
      </div>
    </section>
    <!-- /.content -->
  </div>
</template>

<script>
import * as axios from 'axios'
export default {
  name: 'add',
  data () {
    return {
      // TODO:
      userimg: require('../assets/bigbrother.png')
    }
  },
  methods: {
    signin () {
      ;
    },
    download: function () {
      axios({
        method: 'get',
        url: '../../studentInput1.xlsx',
        responseType: 'arraybuffer'
      })
        .then(
          function (response) {
            let filename = 'poiImport.xlsx'
            this.fileDownload(response.data, filename)
          }.bind(this)
        )
    },
    fileDownload: function (data, fileName) {
      let blob = new Blob([data], {
        type: 'application/octet-stream'
      })
      let filename = fileName || 'filename.xls'
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    }
  }
}
</script>

<style scoped>

</style>
