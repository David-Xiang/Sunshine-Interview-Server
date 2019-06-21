module.exports = {
  proxylist: {
    '/apis': {
      // 测试环境
      target: 'http://129.28.159.207',
      // changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''
      }
    }
  }
};
