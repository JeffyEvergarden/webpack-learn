// css-loader 序列号

module.exports = function (source) {
  const data = JSON.stringify(source)
  console.log('css-loader 序列化：')
  console.log(data)
  return data
}
