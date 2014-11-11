var test = require('tape')

var Graph = require('../')


test('can load data into another graph', function(t) {
  t.plan(7)
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addOutputPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addInputPin(nodeB.id)

  var linkA = graph.linkPins(pinA, pinB)

  var graphB = new Graph()

  graphB.onAddNode(function(node) {
    t.ok(node)
  })

  graphB.onAddPin(function(pin) {
    t.ok(pin)
  })

  graphB.onAddLink(function(from, to) {
    t.equal(from.id, pinA.id)
    t.equal(to.id, pinB.id)
  })

  graphB.load(graph.data)
  t.deepEqual(graph.data, graphB.data)
})

