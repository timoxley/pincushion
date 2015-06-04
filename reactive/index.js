var Emitter = require('events').EventEmitter
var uuid = require('shortid')
var IOGraph = require('../iograph')
var inherits = require('inherits')
var Signal = require('signalfn')
var before = require('beforefn')
var after = require('afterfn')
var d = require('d')

var noop = function noop(){}

function ReactiveGraph() {
  IOGraph.apply(this, arguments)
  Object.defineProperties(this, {
    onAddNode: d(Signal()),
    onRemoveNode: d(Signal()),
    onAddPin: d(Signal()),
    onRemovePin: d(Signal()),
    onAddLink: d(Signal()),
    onRemoveLink: d(Signal())
  })
}

inherits(ReactiveGraph, IOGraph)
ReactiveGraph.__proto__ = Object.create(IOGraph)

var addNode = ReactiveGraph.prototype.addNode
ReactiveGraph.prototype.addNode = after.return(ReactiveGraph.prototype.addNode, function fn(node) {
  this.onAddNode.fire(node)
  return node
})

ReactiveGraph.prototype.removeNode = after.return(ReactiveGraph.prototype.removeNode, function fn(node) {
  this.onRemoveNode.fire(node)
  return node
})

ReactiveGraph.prototype.addPin = after.return(ReactiveGraph.prototype.addPin, function fn(pin) {
  this.onAddPin.fire(pin, this.getNode(pin.nodeId))
  return pin
})

ReactiveGraph.prototype.removePin = after.return(ReactiveGraph.prototype.removePin, function fn(pin) {
  this.onRemovePin.fire(pin, this.getNode(pin.nodeId))
  return pin
})

ReactiveGraph.prototype.addLink = after.return(ReactiveGraph.prototype.addLink, function fn(link) {
  this.onAddLink.fire(this.getPin(link.from), this.getPin(link.to), link)
  return link
})

ReactiveGraph.prototype.removeLink = after.return(ReactiveGraph.prototype.removeLink, function fn(link) {
  this.onRemoveLink.fire(this.getPin(link.from), this.getPin(link.to), link)
  return link
})

module.exports = ReactiveGraph
