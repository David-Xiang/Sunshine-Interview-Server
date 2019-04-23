module.exports = {
  proxylist: {
    '/apis': {
      // 测试环境
      target: 'http://192.168.43.226',
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''
      }
    }
  }
};
