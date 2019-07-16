module.exports = {
  proxylist: {
    '/apis': {
      // 测试环境
      target: 'http://59.110.174.238',
      // changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''
      }
    }
  }
};
