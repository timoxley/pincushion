'use strict'

const assert = require('assertf')
const Graph = require('../lib/graph')

class IOGraph extends Graph {
  createInputPin (pinData) {
    return IOGraph.createInputPin(pinData)
  }

  createOutputPin (pinData) {
    return IOGraph.createOutputPin(pinData)
  }

  addOutputPin (nodeID, pinData) {
    return this.addPin(nodeID, this.createOutputPin(pinData))
  }

  addInputPin (nodeID, pinData) {
    return this.addPin(nodeID, this.createInputPin(pinData))
  }

  getNodeOutputPins (nodeID) {
    return this.getNodePins(nodeID)
    .filter(pin => pin.direction === IOGraph.OUTPUT)
  }

  getNodeInputPins (nodeID) {
    return this.getNodePins(nodeID)
    .filter(pin => pin.direction === IOGraph.INPUT)
  }

  isInputPin (pinID) {
    const pin = this.getPin(id(pinID))
    return pin.direction === IOGraph.INPUT
  }

  isOutputPin (pinID) {
    const pin = this.getPin(id(pinID))
    return pin.direction === IOGraph.OUTPUT
  }

  getLinkForInputPin (pinID) {
    const pin = this.getPin(pinID)
    const link = this.getLinksTo(pin).pop()
    assert.ok(link, 'IOGraph.getLinkForInput: input pin must have an incoming link!')
    return link
  }

  addPin (nodeID, pinData) {
    assert.ok(pinData.direction, 'IOGraph.addPin: pin must have direction')
    return super.addPin(nodeID, pinData)
  }

  linkPins (fromID, toID, link) {
    const from = this.getPin(fromID)
    const to = this.getPin(toID)
    assert.ok(this.isOutputPin(from), 'IOGraph.linkPins: from must be an output: %o', from)
    assert.ok(this.isInputPin(to), 'IOGraph.linkPins: to must be an input: %o', to)

    const linksTo = this.getLinksTo(to)
    assert.equal(linksTo.length, 0, 'Inputs may only have a single link.')
    return super.linkPins(fromID, toID, link)
  }

  addNode (config = {}) {
    config = Object.assign(config, Object.assign({
      inputs: [],
      outputs: []
    }, config))

    const node = super.addNode(config)
    node.inputs = node.inputs.map(pin => {
      if (typeof pin === 'string') return pin
      return this.addInputPin(node.id, pin).id
    })
    node.outputs = node.outputs.map(pin => {
      if (typeof pin === 'string') return pin
      return this.addOutputPin(node.id, pin).id
    })

    return node
  }

  static createInputPin (pinData = {}) {
    pinData = IOGraph.create(IOGraph.INPUT, Object.assign(pinData, Object.assign({}, {
      direction: IOGraph.INPUT
    }, pinData)))

    return this.createPin(pinData)
  }

  static createOutputPin (pinData = {}) {
    pinData = IOGraph.create(IOGraph.OUTPUT, Object.assign(pinData, Object.assign({}, {
      direction: IOGraph.OUTPUT
    }, pinData)))

    return this.createPin(pinData)
  }
}

IOGraph.INPUT =
IOGraph.prototype.INPUT = 'input-pin'

IOGraph.OUTPUT =
IOGraph.prototype.OUTPUT = 'output-pin'

module.exports = IOGraph

function id (objID) {
  if (objID && objID.id) return objID.id
  return objID
}
