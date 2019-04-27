module.exports = {
  proxylist: {
    '/apis': {
      // 测试环境
      target: 'http://127.0.0.1',
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''
      }
    }
  }
};
