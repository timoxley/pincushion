"use strict"
var after = require('afterfn')
var IOGraph = require('../iograph')

IOGraph.prototype.addNode = after.return(IOGraph.prototype.addNode, function fn(node) {
  node.inputs = node.inputs || []
  node.inputs = node.inputs.map(function(pin) {
    return this.addInputPin(node.id, pin).id
  }, this)
  node.outputs = node.outputs || []
  node.outputs = node.outputs.map(function(pin) {
    return this.addOutputPin(node.id, pin).id
  }, this)
  return node
})
