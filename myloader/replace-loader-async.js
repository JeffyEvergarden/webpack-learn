// loader 的结构
// 本质是一个函数 不能是箭头函数
// loader 必须有返回值， string 或者 buffer

// callback使用

module.exports = function (source) {
  // console.log(source) 文件内容
  const content = this.query
  // 如何返回多个信息
  const callback = this.async()
  console.log('尝试等待3秒钟')
  setTimeout(() => {
    console.log('已等待了3秒钟')
    callback(null, source + `\n console.log('${JSON.stringify(content)}')`) // 可以同步或异步返回 比如写在settimeout
  }, 3000)

  // this.async() // 这个函数会告诉loader会有异步代码 返回的就是this.callback
}
