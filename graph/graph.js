"use strict"

var uuid = require('uuid')

function NodeGraph(data) {
  this.data = this.createData(data)
}

NodeGraph.prototype.addNode = function addNode(node) {
  node = this.createNode(node)
  if (this.hasNode(node)) throw new Error('Node already added ' + node.id)
  this.data.nodes[node.id] = node
  return node
}

NodeGraph.prototype.removeNode = function removeNode(nodeId) {
  var node = this.getNode(nodeId)
  delete this.data.nodes[node.id]
  return node
}

NodeGraph.prototype.hasNode = function hasNode(nodeId) {
  nodeId = id(nodeId)
  return !!this.data.nodes[nodeId]
}

NodeGraph.prototype.getNode = function getNode(nodeId) {
  nodeId = id(nodeId)
  var node = this.data.nodes[nodeId]
  if (!node) throw new Error('getNode: not found: ' + nodeId)
  return node
}

NodeGraph.prototype.getNodes = function getNodes() {
  return Object.keys(this.data.nodes).map(function(id) {
    return this.data.nodes[id]
  }, this)
}

NodeGraph.prototype.addPin = function addPin(nodeId, pin) {
  pin = this.createPin(pin)
  if (this.hasPin(pin)) throw new Error('Pin already added ' + pin.id)
  this.data.pins[pin.id] = pin
  pin.nodeId = this.getNode(nodeId).id
  return pin
}

NodeGraph.prototype.hasPin = function hasPin(pinId) {
  pinId = id(pinId)
  return !!this.data.pins[pinId]
}

NodeGraph.prototype.getPin = function getPin(pinId) {
  pinId = id(pinId)
  if (!pinId) throw new Error('getPin: pinId required: ' + pinId)
  var pin = this.data.pins[pinId]
  if (!pin) throw new Error('getPin: not found: ' + pinId)
  return pin
}

NodeGraph.prototype.removePin = function removePin(pinId) {
  var pin = this.getPin(pinId)
  delete this.data.pins[pin.id]
  return pin
}

NodeGraph.prototype.getNodePins = function getNodePins(nodeId) {
  var node = this.getNode(nodeId)
  return this.getPins().filter(function(pin) {
    return pin.nodeId === node.id
  }, this)
}

NodeGraph.prototype.getNodeForPin = function getNodeForPin(pin) {
  pin = this.getPin(pin)
  return this.getNode(pin.nodeId)
}

NodeGraph.prototype.getPins = function getPins() {
  return Object.keys(this.data.pins).map(function(pinId) {
    return this.getPin(pinId)
  }, this)
}

NodeGraph.prototype.linkPins = function linkPins(fromId, toId, link) {
  link = this.createLink(link)
  link.from = this.getPin(fromId).id
  link.to = this.getPin(toId).id
  link = this.addLink(link)
  return link
}

NodeGraph.prototype.unlinkPins = function unlinkPins(fromId, toId) {
  var link = this.getLinkFromTo(fromId, toId)
  return this.removeLink(link)
}

NodeGraph.prototype.addLink = function addLink(link) {
  var link = this.createLink(link)
  if (this.hasLink(link)) throw new Error('Link already added ' + link.id)
  if (!(link.from && link.to)) throw new Error('Link requires from and to')
  if (this.getLinkFromTo(link.from, link.to)) throw new Error('pins already linked')
  this.data.links[link.id] = link
  return link
}

NodeGraph.prototype.hasLink = function hasLink(linkId) {
  linkId = id(linkId)
  return !!this.data.links[linkId]
}

NodeGraph.prototype.removeLink = function removeLink(linkId) {
  var link = this.getLink(linkId)
  delete this.data.links[link.id]
  return link
}

NodeGraph.prototype.getLinkFromTo = function addNode(fromId, toId) {
  var fromPin = this.getPin(fromId)
  var toPin = this.getPin(toId)
  return this.getLinksFrom(fromPin).filter(function(link) {
    return link.to === toPin.id
  }).pop()
}

NodeGraph.prototype.getPinsFrom = function getPinsFrom(fromId) {
  var fromPin = this.getPin(fromId)
  return this.getLinksFrom(fromPin).map(function(link) {
    return this.getPin(link.to)
  }, this)
}

NodeGraph.prototype.getPinsTo = function getPinsTo(toId) {
  var toPin = this.getPin(toId)
  return this.getLinksTo(toPin).map(function(link) {
    return this.getPin(link.from)
  }, this)
}

NodeGraph.prototype.getLinks = function getLinks() {
  return Object.keys(this.data.links).map(function(linkId) {
   return this.getLink(linkId)
  }, this)
}

NodeGraph.prototype.hasLinksFrom = function hasLinksFrom(pin) {
  pin = this.getPin(pin)
  return !!this.getLinksFrom(pin).length
}

NodeGraph.prototype.hasLinksTo = function hasLinksTo(pin) {
  pin = this.getPin(pin)
  return !!this.getLinksTo(pin).length
}

NodeGraph.prototype.getLinksFrom = function getLinksFrom(fromId) {
  var fromPin = this.getPin(fromId)
  return this.getLinks().filter(function(link) {
    return link.from === fromPin.id
  }, this)
}

NodeGraph.prototype.getLinksTo = function getLinksTo(toId) {
  var toPin = this.getPin(toId)
  return this.getLinks().filter(function(link) {
    return link.to === toPin.id
  }, this)
}

NodeGraph.prototype.getLink = function getLink(linkId) {
  linkId = id(linkId)
  var link = this.data.links[linkId]
  if (!link) throw new Error('getLink: not found: ' + linkId)
  return link
}

NodeGraph.prototype.getAllLinksFor = function getAllLinksFor(pinId) {
  var pin = this.getPin(pinId)
  return this.getLinksFrom(pin).concat(this.getLinksTo(pin))
}

NodeGraph.createNode =
NodeGraph.prototype.createNode = function createNode(data) {
  data = data || {}
  data.id = data.id || 'node:' + uuid()
  return data
}

NodeGraph.createData =
NodeGraph.prototype.createData = function createGraph(data) {
  data = data || {}
  data.nodes = data.nodes || {}
  data.links = data.links || {}
  data.pins = data.pins || {}
  return data
}

NodeGraph.createPin =
NodeGraph.prototype.createPin = function createPin(data) {
  data = data || {}
  data.id = data.id || 'pin:' + uuid()
  return data
}

NodeGraph.createLink =
NodeGraph.prototype.createLink = function createLink(data) {
  data = data || {}
  data.id = data.id || 'link:' + uuid()
  return data
}

var pkg = require('../package.json')

function id(objId) {
  if (objId && objId.id) return objId.id
  return objId
}

module.exports = NodeGraph
