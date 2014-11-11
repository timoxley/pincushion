module.exports = function(graph, data) {
  data = graph.createData(data)

  for (var nodeId in data.nodes) {
    var node = data.nodes[nodeId]
    if (!graph.hasNode(node)) graph.addNode(node)
  }
  for (var pinId in data.pins) {
    var pin = data.pins[pinId]
    if (!graph.hasPin(pin)) graph.addPin(pin.nodeId, pin)
  }

  for (var linkId in data.links) {
    var link = data.links[linkId]
    if (!graph.hasLink(link)) graph.linkPins(link.from, link.to, link)
  }
}
