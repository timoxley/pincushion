var test = require('tape')

var Graph = require('../')

test('fires onAddNode on node add', function(t) {
  var graph = new Graph()
  var node = {}
  graph.onAddNode(function(firedNode) {
    t.equal(firedNode, node)
    t.end()
  })
  graph.addNode(node)
  t.ok(node)
})

test('fires onRemoveNode on node remove', function(t) {
  var graph = new Graph()
  var node = {}
  graph.onRemoveNode(function(firedNode) {
    t.equal(firedNode, node)
    t.end()
  })
  graph.addNode(node)
  var removedNode = graph.removeNode(node)
  t.equal(removedNode, node)
})

test('fires onAddPin on pin add', function(t) {
  var graph = new Graph()
  var node = {}
  var pin = {}

  graph.onAddPin(function(firedPin, firedNode) {
    t.equal(firedPin, pin)
    t.equal(firedNode, node)
    t.end()
  })

  graph.addNode(node)
  graph.addOutputPin(node, pin)
  t.ok(pin)
})

test('fires onRemovePin on pin remove', function(t) {
  var graph = new Graph()
  var node = {}

  graph.onRemovePin(function(firedPin, firedNode) {
    t.equal(firedPin, pin)
    t.equal(firedNode, node)
    t.end()
  })

  graph.addNode(node)
  var pin = graph.addOutputPin(node)
  var removedPin = graph.removePin(pin)
  t.equal(removedPin, pin)
})

test('fires signal on link add', function(t) {
  var graph = new Graph()
  var firedLink = undefined
  graph.onAddLink(function(firedPinFrom, firedPinTo, theFiredLink) {
    t.equal(firedPinFrom, pinFrom)
    t.equal(firedPinTo, pinTo)
    firedLink = theFiredLink
    t.end()
  })

  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var pinFrom = graph.addOutputPin(nodeA)
  var pinTo = graph.addInputPin(nodeB)
  var link = graph.linkPins(pinFrom, pinTo)
  t.equal(link, firedLink)
  t.ok(link)
})

test('fires signal on link remove', function(t) {
  var graph = new Graph()
  graph.onRemoveLink(function(firedPinFrom, firedPinTo, firedLink) {
    t.equal(firedPinFrom, pinFrom)
    t.equal(firedPinTo, pinTo)
    t.equal(firedLink, link)
    t.end()
  })

  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var pinFrom = graph.addOutputPin(nodeA)
  var pinTo = graph.addInputPin(nodeB)
  var link = graph.linkPins(pinFrom, pinTo)
  var removedLink = graph.removeLink(link)
  t.equal(link, removedLink)
})

test('successfully removes nodes linked from', function(t) {
  var graph = new Graph()
  graph.onRemoveNode(function(firedNode) {
    t.equal(firedNode, nodeA)
    t.end()
  })

  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var pinFrom = graph.addOutputPin(nodeA)
  var pinTo = graph.addInputPin(nodeB)
  var link = graph.linkPins(pinFrom, pinTo)
  graph.removeNode(nodeA)
})

test('successfully removes nodes linked to', function(t) {
  var graph = new Graph()
  graph.onRemoveNode(function(firedNode) {
    t.equal(firedNode, nodeB)
    t.end()
  })

  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var pinFrom = graph.addOutputPin(nodeA)
  var pinTo = graph.addInputPin(nodeB)
  var link = graph.linkPins(pinFrom, pinTo)
  graph.removeNode(nodeB)
})

test('fires onRemoveLink when removing a linked node', function(t) {
  var graph = new Graph()
  graph.onRemoveLink(function(firedPinFrom, firedPinTo, firedLink) {
    t.equal(firedPinFrom, pinFrom)
    t.equal(firedPinTo, pinTo)
    t.equal(firedLink, link)
    t.end()
  })

  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var pinFrom = graph.addOutputPin(nodeA)
  var pinTo = graph.addInputPin(nodeB)
  var link = graph.linkPins(pinFrom, pinTo)
  graph.removeNode(nodeA)
})
