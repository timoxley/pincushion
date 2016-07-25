const IOGraph = require('../lib/iograph')
const Signal = require('signalfn')
const d = require('d')

class ReactiveGraph extends IOGraph {
  constructor (data) {
    super(data)
    Object.defineProperties(this, {
      onAddNode: d(Signal()),
      onRemoveNode: d(Signal()),
      onAddPin: d(Signal()),
      onRemovePin: d(Signal()),
      onAddLink: d(Signal()),
      onRemoveLink: d(Signal())
    })
  }

  addNode (node) {
    node = super.addNode(node)
    this.onAddNode.fire(node)
    return node
  }

  removeNode (node) {
    node = super.removeNode(node)
    this.onRemoveNode.fire(node)
    return node
  }

  addPin (nodeID, pin) {
    pin = super.addPin(nodeID, pin)
    this.onAddPin.fire(pin, this.getNode(pin.nodeID))
    return pin
  }

  removePin (pin) {
    pin = super.removePin(pin)
    this.onRemovePin.fire(pin, this.getNode(pin.nodeID))
    return pin
  }

  addLink (link) {
    link = super.addLink(link)
    this.onAddLink.fire(this.getPin(link.from), this.getPin(link.to), link)
    return link
  }

  removeLink (link) {
    link = super.removeLink(link)
    this.onRemoveLink.fire(this.getPin(link.from), this.getPin(link.to), link)
    return link
  }
}

module.exports = ReactiveGraph
