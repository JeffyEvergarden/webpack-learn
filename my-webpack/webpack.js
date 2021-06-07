const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const path = require('path')
const fs = require('fs')
const { transformFromAst } = require('@babel/core')

module.exports = class webpack {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.dir = path.dirname(this.entry)
    this.modules = []
  }
  run() {
    const info = this.parse(this.entry)
    this.modules.push(info)
    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i]
      const { yilai } = item
      if (yilai) {
        for (let j in yilai) {
          this.modules.push(this.parse(yilai[j]))
        }
      }
    }

    const obj = {}
    this.modules.forEach((item) => {
      obj[item.entryFile] = item
    })
    console.log(obj) // 此时获得了 图谱

    this.gennerateCode(obj) // 生成代码和创建bundle文件
  }

  parse(entryFile) {
    const content = fs.readFileSync(entryFile, 'utf-8')
    const ast = parser.parse(content, {
      sourceType: 'module', // es6
    })

    // 实际要的是 ast.program.body    ===> [ [Node], [Node], [Node] ] 行代码

    const yilai = {}
    const prePath = path.dirname(entryFile)
    const currentPath = traverse(ast, {
      ImportDeclaration({ node }) {
        // console.log(node) // 过滤出来 type 为 ImportDeclaration 节点
        // 要的 node.source.value
        // 对路径做拼接
        const newPath = './' + path.join(prePath, node.source.value)
        yilai[node.source.value] = newPath.replace(/\\/g, '/')
      },
    })
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    })

    return {
      entryFile,
      yilai,
      code,
    }
  }

  gennerateCode(obj) {
    const filePath = path.join(this.output.path, this.output.filename) // 输出文件目录和名
    const content = `(function (modules) {

      // 加载函数
      function require(module) {
        
        function newRequire(relativePath) {
          // .a.js => ./src/a.js
          return require(modules[module].yilai[relativePath])
        }

        const exports = {};

        (function(require, code) {
          eval(code)
        })(newRequire, modules[module].code)
        
        return exports
      }

      return require('${this.entry}')  /* ./src/index.js  */
    })(${JSON.stringify(obj)})`

    fs.writeFileSync(filePath, content, 'utf-8')
  }
}
