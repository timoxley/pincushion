'use strict'

const uuid = require('shortid')
const assert = require('assertf')

module.exports = class NodeGraph {
  constructor (data) {
    this.data = this.createData(data)
  }

  addNode (node) {
    node = this.createNode(node)
    assert.ok(!this.hasNode(node), 'addNode: Node already added: %s.', node.id)
    this.data.nodes[node.id] = node
    return node
  }

  removeNode (nodeID) {
    const node = this.getNode(nodeID)
    const pins = this.getNodePins(node)
    pins.forEach(pin => this.removePin(pin.id))
    delete this.data.nodes[node.id]
    return node
  }

  hasNode (nodeID) {
    nodeID = id(nodeID)
    return !!this.data.nodes[nodeID]
  }

  getNode (nodeID) {
    nodeID = id(nodeID)
    var node = this.data.nodes[nodeID]
    assert.ok(node, 'getNode: Node not found: %s.', nodeID)
    return node
  }

  getNodes () {
    return Object.keys(this.data.nodes)
    .map(id => this.data.nodes[id])
  }

  addPin (nodeID, pin) {
    pin = this.createPin(pin)
    assert.ok(!this.hasPin(pin), 'addPin: Pin already added: %s.', pin.id)
    this.data.pins[pin.id] = pin
    pin.nodeID = this.getNode(nodeID).id
    return pin
  }

  hasPin (pinID) {
    pinID = id(pinID)
    return !!this.data.pins[pinID]
  }

  getPin (pinID) {
    pinID = id(pinID)
    assert.ok(pinID, 'getPin: pinID required: %s.', pinID)
    const pin = this.data.pins[pinID]
    assert.ok(pin, 'getPin: Pin not found: %s.', pinID)
    return pin
  }

  removePin (pinID) {
    // remove links to pin before removing pin
    this.getAllLinksFor(pinID).forEach(link => this.removeLink(link.id))

    const pin = this.getPin(pinID)
    delete this.data.pins[pin.id]
    return pin
  }

  getNodePins (nodeID) {
    const node = this.getNode(nodeID)
    return this.getPins()
    .filter(pin => pin.nodeID === node.id)
  }

  getNodeForPin (pinID) {
    const pin = this.getPin(pinID)
    return this.getNode(pin.nodeID)
  }

  getPins () {
    return Object.keys(this.data.pins)
    .map(pinID => this.getPin(pinID))
  }

  linkPins (fromPinID, toPinID, link) {
    link = Object.assign(this.createLink(link), {
      from: this.getPin(fromPinID).id,
      to: this.getPin(toPinID).id
    })

    return this.addLink(link)
  }

  unlinkPins (fromPinID, toPinID) {
    const link = this.getLinkFromTo(fromPinID, toPinID)
    return this.removeLink(link)
  }

  addLink (link) {
    link = this.createLink(link)
    assert.ok(!this.hasLink(link), 'Link already added %s.', link.id)
    assert.ok(link.from, 'Link requires from.')
    assert.ok(link.to, 'Link requires to.')
    assert.ok(!this.getLinkFromTo(link.from, link.to), 'pins already linked: %s %s', link.from, link.to)
    this.data.links[link.id] = link
    return link
  }

  hasLink (linkID) {
    linkID = id(linkID)
    return !!this.data.links[linkID]
  }

  removeLink (linkID) {
    const link = this.getLink(linkID)
    delete this.data.links[link.id]
    return link
  }

  getLinkFromTo (fromPinID, toPinID) {
    const fromPin = this.getPin(fromPinID)
    const toPin = this.getPin(toPinID)
    return this.getLinksFrom(fromPin).find(link => link.to === toPin.id)
  }

  getPinsFrom (fromPinID) {
    const fromPin = this.getPin(fromPinID)
    return this.getLinksFrom(fromPin)
    .map(link => this.getPin(link.to))
  }

  getPinsTo (toPinID) {
    const toPin = this.getPin(toPinID)
    return this.getLinksTo(toPin)
    .map(link => this.getPin(link.from))
  }

  getLinks () {
    return Object.keys(this.data.links)
    .map(linkID => this.getLink(linkID))
  }

  hasLinksFrom (fromPinID) {
    const fromPin = this.getPin(fromPinID)
    return !!this.getLinksFrom(fromPin).length
  }

  hasLinksTo (toPinID) {
    const toPin = this.getPin(toPinID)
    return !!this.getLinksTo(toPin).length
  }

  getLinksFrom (fromPinID) {
    const fromPin = this.getPin(fromPinID)
    return this.getLinks()
    .filter(link => link.from === fromPin.id)
  }

  getLinksTo (toPinID) {
    const toPin = this.getPin(toPinID)
    return this.getLinks()
    .filter(link => link.to === toPin.id)
  }

  getLink (linkID) {
    linkID = id(linkID)
    const link = this.data.links[linkID]
    assert.ok(link, 'getLink: not found: %s.', linkID)
    return link
  }

  getAllLinksFor (pinID) {
    const pin = this.getPin(pinID)
    return this.getLinksFrom(pin)
    .concat(this.getLinksTo(pin))
  }

  createData (data = {}) {
    data && assert.equal(typeof data, 'object', 'data must be an object: %s', data)
    return NodeGraph.createData(data)
  }

  createNode (data) {
    return NodeGraph.createNode(data)
  }

  createPin (data) {
    return NodeGraph.createPin(data)
  }

  createLink (data) {
    return NodeGraph.createLink(data)
  }

  static createData (data = {}) {
    return Object.assign(data, Object.assign({}, {
      nodes: {},
      links: {},
      pins: {}
    }, data))
  }

  static create (name, data = {}) {
    if ('id' in data) return data
    return Object.assign(data, {
      id: `${name}:${uuid()}`
    }, data)
  }

  static createNode (node) {
    return NodeGraph.create('node', node)
  }

  static createLink (link) {
    return NodeGraph.create('link', link)
  }

  static createPin (pin) {
    return NodeGraph.create('pin', pin)
  }
}

function id (objID) {
  if (objID && objID.id) return objID.id
  return objID
}
