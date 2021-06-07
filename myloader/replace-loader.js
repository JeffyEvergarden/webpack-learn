// loader 的结构
// 本质是一个函数 不能是箭头函数
// loader 必须有返回值， string 或者 buffer
module.exports = function (source) {
  // console.log(source) 文件内容
  // loader api:
  // this.query 表示传进来得 options
  console.log('this.query:')  
  console.log(this.query) 
  return source.replace('webpack', 'huihui 卡子')
}
