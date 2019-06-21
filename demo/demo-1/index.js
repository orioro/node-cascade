const @orioro/cascade = require('../../src')

console.log(@orioro/cascade())

document.querySelector('body').innerHTML = `Demo: ${@orioro/cascade()}`
