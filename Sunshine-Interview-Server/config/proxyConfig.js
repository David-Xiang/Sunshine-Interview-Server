module.exports = {
  proxylist: {
    '/apis': {
      // 测试环境
      target: 'http://10.0.21.250',
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''
      }
    }
  }
};
