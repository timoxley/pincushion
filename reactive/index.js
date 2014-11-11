var Emitter = require('events').EventEmitter
var uuid = require('uuid')

var IOGraph = require('../iograph')
var inherits = require('inherits')
var Signal = require('signalfn')
var before = require('beforefn')
var after = require('afterfn')

var noop = function noop(){}

function ReactiveGraph() {
  IOGraph.apply(this, arguments)
  this.onAddNode = Signal()
  this.onRemoveNode = Signal()
  this.onAddPin = Signal()
  this.onRemovePin = Signal()
  this.onAddLink = Signal()
  this.onRemoveLink = Signal()
}

inherits(ReactiveGraph, IOGraph)
ReactiveGraph.__proto__ = Object.create(IOGraph)

var addNode = ReactiveGraph.prototype.addNode
ReactiveGraph.prototype.addNode = after.return(ReactiveGraph.prototype.addNode, function fn(node) {
  var self = this
  process.nextTick(function() {
    self.onAddNode.fire(node)
  })
  return node
})

ReactiveGraph.prototype.removeNode = after.return(ReactiveGraph.prototype.removeNode, function fn(node) {
  var self = this
  process.nextTick(function() {
    self.onRemoveNode.fire(node)
  })
  return node
})

ReactiveGraph.prototype.addPin = after.return(ReactiveGraph.prototype.addPin, function fn(pin) {
  var self = this
  process.nextTick(function() {
    self.onAddPin.fire(pin, self.getNode(pin.nodeId))
  })
  return pin
})

ReactiveGraph.prototype.removePin = after.return(ReactiveGraph.prototype.removePin, function fn(pin) {
  var self = this
  process.nextTick(function() {
    self.onRemovePin.fire(pin, self.getNode(pin.nodeId))
  })
  return pin
})

ReactiveGraph.prototype.addLink = after.return(ReactiveGraph.prototype.addLink, function fn(link) {
  var self = this
  process.nextTick(function() {
    self.onAddLink.fire(self.getPin(link.from), self.getPin(link.to), link)
  })
  return link
})

ReactiveGraph.prototype.removeLink = after.return(ReactiveGraph.prototype.removeLink, function fn(link) {
  var self = this
  process.nextTick(function() {
    self.onRemoveLink.fire(self.getPin(link.from), self.getPin(link.to), link)
  })
  return link
})

module.exports = ReactiveGraph
