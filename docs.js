// does most of the work for generating the API overview in the readme

const protochain = require('protochain')
const PinCushion = require('./')

const target = new PinCushion()
const targets = protochain(target).filter(p => p !== Object.prototype)

const propertyNames = Array.from(new Set([...targets.map(target => {
  return Object.getOwnPropertyNames(target)
})].reduce((a, b) => a.concat(b), [])))

const functionSources = propertyNames
.filter(name => typeof target[name] === 'function')
.map(name => {
  return target[name].toString()
})

const sigs = functionSources.map(func => func.split('\n')[0].split(/(function | {$)/)[2]).filter(Boolean)

const sortedSigs = sigs.map(s => {
  const n = s.toLowerCase()
  return [
    Number(n.includes('pin')) + Number(n.includes('link')) * 10,
    s
  ]
})
.sort((a, b) => {
  return a[0] - b[0]
})
.map(a => a[1])

const docs = sortedSigs.map(funcSig => '#### ' + funcSig)

console.log(docs.join('\n\n'))
