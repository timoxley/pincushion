var test = require('tape')

var IOGraph = require('../iograph')

test('createOutputPin creates output pins', function(t) {
  var pin = IOGraph.createOutputPin()
  t.ok(pin)
  t.equal(pin.direction, IOGraph.OUTPUT)
  t.end()
})

test('createInputPin creates input pins', function(t) {
  var pin = IOGraph.createInputPin()
  t.ok(pin)
  t.equal(pin.direction, IOGraph.INPUT)
  t.end()
})

test('addOutputPin creates output pins', function(t) {
  var graph = new IOGraph()
  var node = graph.addNode()
  var pin = graph.addOutputPin(node.id)
  t.ok(pin)
  t.equal(pin.direction, IOGraph.OUTPUT)
  t.end()
})

test('addInputPin creates input pins', function(t) {
  var graph = new IOGraph()
  var node = graph.addNode()
  var pin = graph.addInputPin(node.id)
  t.ok(pin)
  t.equal(pin.direction, IOGraph.INPUT)
  t.end()
})

test('isOutputPin matches output pins', function(t) {
  var graph = new IOGraph()
  var node = graph.addNode()
  var inputPin = graph.addInputPin(node.id)
  var outputPin = graph.addOutputPin(node.id)
  t.ok(graph.isOutputPin(outputPin))
  t.ok(graph.isOutputPin(outputPin.id))
  t.notOk(graph.isOutputPin(inputPin))
  t.notOk(graph.isOutputPin(inputPin.id))
  t.end()
})

test('isInputPin matches input pins', function(t) {
  var graph = new IOGraph()
  var node = graph.addNode()
  var inputPin = graph.addInputPin(node.id)
  var outputPin = graph.addOutputPin(node.id)

  t.ok(graph.isInputPin(inputPin))
  t.ok(graph.isInputPin(inputPin.id))
  t.notOk(graph.isInputPin(outputPin))
  t.notOk(graph.isInputPin(outputPin.id))
  t.end()
})

test('getNodeOutputPins gets output pins', function(t) {
  var graph = new IOGraph()
  var node = graph.addNode()
  var pin1 = graph.addOutputPin(node.id)
  var pin2 = graph.addOutputPin(node.id)
  var pin3 = graph.addInputPin(node.id)

  // should not include pin3 as it's an input
  t.deepEqual(graph.getNodeOutputPins(node.id), [pin1, pin2])
  t.end()
})

test('getNodeInputPins gets input pins', function(t) {
  var graph = new IOGraph()
  var node = graph.addNode()
  var pin1 = graph.addInputPin(node.id)
  var pin2 = graph.addInputPin(node.id)
  var pin3 = graph.addOutputPin(node.id)

  // should not include pin3 as it's an output
  t.deepEqual(graph.getNodeInputPins(node.id), [pin1, pin2])
  t.end()
})

test('getLinkForInputPin gets single link for input pin', function(t) {
  var graph = new IOGraph()
  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var outputPin = graph.addOutputPin(nodeA)
  var inputPin = graph.addInputPin(nodeB)

  var expected = graph.linkPins(outputPin, inputPin)
  var actual = graph.getLinkForInputPin(inputPin)
  t.equal(expected, actual)
  t.end()
})

test('getLinkForInputPin throws if if no link for input pin', function(t) {
  var graph = new IOGraph()
  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var outputPin = graph.addOutputPin(nodeA)
  var inputPin = graph.addInputPin(nodeB)
  t.throws(function() {
    graph.getLinkForInputPin(inputPin)
  })
  t.end()
})

test('IOGraph ensures output pins can be connected to input pins', function(t) {
  var graph = new IOGraph()
  var nodeA = graph.addNode()
  var pinA = graph.addOutputPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addInputPin(nodeB.id)

  graph.linkPins(pinA.id, pinB.id)
  t.deepEqual(graph.getPinsFrom(pinA.id), [pinB], 'should have linked from')
  t.deepEqual(graph.getPinsTo(pinB.id), [pinA], 'should have linked to')
  t.end()
})

test('IOGraph ensures output pins are connected to input pins', function(t) {
  var graph = new IOGraph()
  var nodeA = graph.addNode()
  var pinA = graph.addOutputPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addOutputPin(nodeB.id)

  t.throws(function() {
    graph.linkPins(pinA.id, pinB.id)
  })

  t.deepEqual(graph.getPinsFrom(pinA.id), [], 'should not have linked from')
  t.deepEqual(graph.getPinsTo(pinB.id), [], 'should not have linked to')
  t.end()
})

test('IOGraph ensures only single connections to input pins', function(t) {
  var graph = new IOGraph()
  var nodeA = graph.addNode()
  var outputA = graph.addOutputPin(nodeA)
  var outputB = graph.addOutputPin(nodeA)

  var nodeB = graph.addNode()
  var inputPin = graph.addInputPin(nodeB)

  graph.linkPins(outputA, inputPin)
  t.throws(function() {
    graph.linkPins(outputB, inputPin)
  })

  t.deepEqual(graph.getPinsFrom(outputA), [inputPin], 'should have linked from')
  t.deepEqual(graph.getPinsFrom(outputB), [], 'should not have linked already linked')
  t.deepEqual(graph.getPinsTo(inputPin), [outputA], 'should have linked to')
  t.end()
})

test('IOGraph pins must have direction', function(t) {
  var graph = new IOGraph()
  var nodeA = graph.addNode()

  t.throws(function() {
    graph.addPin(nodeA.id)
  })
  t.end()
})

