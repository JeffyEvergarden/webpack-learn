const less = require('less')

module.exports = function (source) {
  less.render(source, (err, output) => {
    console.log('less-loader output:', output)
    this.callback(err, output.css)
    // output.css 包含转义成css代码
  })
}
