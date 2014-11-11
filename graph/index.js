"use strict"

var NodeGraph = require('./graph')
var before = require('beforefn')
var after = require('afterfn')
var assert = require('assertf')

NodeGraph.createData =
NodeGraph.prototype.createData = before(NodeGraph.createData, function fn(data) {
  data && assert.equal(typeof data, 'object', 'data must be an object: %s', data)
})

NodeGraph.prototype.removeNode = before(NodeGraph.prototype.removeNode, function fn(nodeId) {
  var pins = this.getNodePins(nodeId)
  pins.forEach(function(pin) {
    this.removePin(pin.id)
  }, this)
})

NodeGraph.prototype.removePin = before(NodeGraph.prototype.removePin, function fn(pinId) {
  var links = this.getAllLinksFor(pinId)
  links.forEach(function(link) {
    this.removeLink(link.id)
  }, this)
})

//NodeGraph.prototype.addLink = before(NodeGraph.prototype.addLink, function fn(link) {
  //link = this.createLink(link)
  //if (!(link.from && link.to)) throw new Error('Link requires from and to')
  //var links = this.getLinksFromTo(link.from, link.to)
  //if (links.length) throw new Error('pins already linked')
//})

module.exports = NodeGraph
