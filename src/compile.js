import { baseCompile } from '@vue/compiler-core'

let app = document.getElementById('app')

let ret = baseCompile(app.innerHTML)

console.log(ret)
