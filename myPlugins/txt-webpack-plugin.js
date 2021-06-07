module.exports = class Txtwebpackplugin {
  constructor(options) {}
  apply(compiler) {
    // 打印事件名称和钩子

    // 异步钩子调用测试
    compiler.hooks.emit.tapAsync('generator-txt', (compilation, cb) => {
      const target = compilation.assets
      const length = Object.keys(compilation.assets).length
      console.log(length)
      compilation.assets['text.txt'] = {
        source: function () {
          let str = `文件数目: ${length} \n`
          Object.keys(target).forEach((name) => {
            console.log(name)
            const fn = target[name].size()
            str = str + name + '：-----------' + fn + '\n'
          })
          // 定义资源内容
          return str
        },
        size: function () {
          // 定义资源大小  kb
          return 1024
        },
      }
      cb()
    })
  }
}
