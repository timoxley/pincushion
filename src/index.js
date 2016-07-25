'use strict'

const ReactiveGraph = require('./lib/reactivegraph')

module.exports = class Graph extends ReactiveGraph {
  load (data) {
    return Graph.load(this, data)
  }

  static load (graph, data) {
    data = graph.createData(data)

    for (let nodeID in data.nodes) {
      const node = data.nodes[nodeID]
      if (!graph.hasNode(node)) {
        graph.addNode(node)
      }
    }

    for (let pinID in data.pins) {
      const pin = data.pins[pinID]
      if (!graph.hasPin(pin)) graph.addPin(pin.nodeID, pin)
    }

    for (let linkID in data.links) {
      const link = data.links[linkID]
      if (!graph.hasLink(link)) graph.linkPins(link.from, link.to, link)
    }
  }
}
