<template>
  <div class="content body">
  <section class="invoice">
    <!-- title row -->
    <div class="row">
      <div class="col-xs-12">
        <h2 class="page-header">
          <i class="fa fa-globe"></i> 联系我们
        </h2>
      </div>
      <!-- /.col -->
    </div>

    <!-- Table row -->
    <div class="row">
      <div class="col-xs-12 table-responsive">
        <table class="table table-striped">
          <tbody>
          <tr>
            <td>如需开通系统账号、修改账号密码、获取查验权限，请通过电子邮箱及电话方式与我们联系。</td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->

    <div class="row">
      <!-- accepted payments column -->
      <div class="col-xs-6">
        <p class="lead">联系方式</p>

        <div class="table-responsive">
          <table class="table">
            <tbody><tr>
              <th style="width:50%">电子邮箱:</th>
              <td>sunshineinterview@pku.edu.cn</td>
            </tr>
            <tr>
              <th>联系电话</th>
              <td>010-62756666</td>
            </tr>
            </tbody></table>
        </div>
      </div>
      <!-- /.col -->
      <div class="col-xs-6">
        <p class="lead">了解更多</p>
        <!--        <img src="../../dist/img/credit/visa.png" alt="Visa">-->
        <!--        <img src="../../dist/img/credit/mastercard.png" alt="Mastercard">-->
        <!--        <img src="../../dist/img/credit/american-express.png" alt="American Express">-->
        <!--        <img src="../../dist/img/credit/paypal2.png" alt="Paypal">-->
        <img :src= wechat height="200">

        <p class="text-muted well well-sm no-shadow" style="margin-top: 10px; width:400px">
          关注微信公众号，了解更多考试动向。
        </p>
        <p class="text-muted well well-sm" style="margin-top: 10px; width:300px" align="center">
          关注微信公众号，了解更多考试动向。
        </p>
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->

    <!-- this row will not appear when printing -->
<!--    <div class="row no-print">-->
<!--      <div class="col-xs-12">-->
<!--        <a href="invoice-print.html" target="_blank" class="btn btn-default"><i class="fa fa-print"></i> Print</a>-->
<!--        <button type="button" class="btn btn-success pull-right"><i class="fa fa-credit-card"></i> Submit Payment-->
<!--        </button>-->
<!--        <button type="button" class="btn btn-primary pull-right" style="margin-right: 5px;">-->
<!--          <i class="fa fa-download"></i> Generate PDF-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->
  </section>
  </div>
</template>

<script>
export default {
  name: 'contactUs',
  data () {
    return {
      wechat: require('../assets/contactus.jpg')
    }
  }
}
</script>

<style scoped>

</style>
