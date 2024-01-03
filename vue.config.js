const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint校验
  lintOnSave: false,
  devServer: {
    proxy: {
      '/user': {
        target: 'http://172.27.221.170:2023',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://172.27.221.170:2023',
        changeOrigin: true
      }
    }
  }
})

