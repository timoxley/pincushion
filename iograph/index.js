"use strict"

var inherits = require('inherits')
var before = require('beforefn')
var assert = require('assertf')
var uuid = require('uuid')
var Graph = require('../graph')

function IOGraph() {
  Graph.apply(this, arguments)
}

inherits(IOGraph, Graph)
IOGraph.__proto__ = Object.create(Graph)

IOGraph.createInputPin =
IOGraph.prototype.createInputPin = function createInputPin(pinData) {
  pinData = pinData || {}
  pinData.id = pinData.id || 'input-pin:' + uuid()
  pinData.direction = this.INPUT
  return this.createPin(pinData)
}

IOGraph.createOutputPin =
IOGraph.prototype.createOutputPin = function createOutputPin(pinData) {
  pinData = pinData || {}
  pinData.id = pinData.id || 'output-pin:' + uuid()
  pinData.direction = this.OUTPUT
  return this.createPin(pinData)
}

IOGraph.prototype.addOutputPin = function addOutputPin(nodeId, pinData) {
  pinData = pinData || {}
  pinData.direction = this.OUTPUT
  return this.addPin(nodeId, pinData)
}

IOGraph.prototype.addInputPin = function addInputPin(nodeId, pinData) {
  pinData = pinData || {}
  pinData.direction = this.INPUT
  return this.addPin(nodeId, pinData)
}

IOGraph.prototype.getNodeOutputPins = function getNodeOutputPins(nodeId) {
  return this.getNodePins(nodeId).filter(function(pin) {
    return pin.direction === IOGraph.OUTPUT
  })
}

IOGraph.prototype.getNodeInputPins = function getNodeInputPins(nodeId) {
  return this.getNodePins(nodeId).filter(function(pin) {
    return pin.direction === IOGraph.INPUT
  })
}

IOGraph.prototype.isInputPin = function isInputPin(pinId) {
  if (pinId && pinId.id) return this.isInputPin(pinId.id)
  var pin = this.getPin(pinId)
  return pin.direction == IOGraph.INPUT
}

IOGraph.prototype.isOutputPin = function isOutputPin(pinId) {
  var pin = this.getPin(pinId)
  return pin.direction == IOGraph.OUTPUT
}

IOGraph.prototype.getLinkForInputPin = function getLinkForInputPin(pinId) {
  var pin = this.getPin(pinId)
  var link = this.getLinksTo(pin).pop()
  assert.ok(link, 'IOGraph.getLinkForInput: input pin must have an incoming link!')
  return link
}

IOGraph.prototype.addPin = before(IOGraph.prototype.addPin, function fn(nodeId, pinData) {
  assert.ok(pinData.direction, 'IOGraph.addPin: pin must have direction')
})

IOGraph.prototype.linkPins = before(IOGraph.prototype.linkPins, function fn(fromId, toId, link) {
  var from = this.getPin(fromId)
  var to = this.getPin(toId)
  assert.ok(this.isOutputPin(from), 'IOGraph.linkPins: from must be an output: %o', from)
  assert.ok(this.isInputPin(to), 'IOGraph.linkPins: to must be an input: %o', to)

  var linksTo = this.getLinksTo(to)
  assert.equal(linksTo.length, 0, 'Inputs may only have a single link.')
})

IOGraph.INPUT =
IOGraph.prototype.INPUT = 'input-pin'

IOGraph.OUTPUT =
IOGraph.prototype.OUTPUT = 'output-pin'

module.exports = IOGraph
