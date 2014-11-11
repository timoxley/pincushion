var test = require('tape')
var uuid = require('uuid')

var Graph = require('../graph')

test('can only link between pins once', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  var linkA = graph.linkPins(pinA, pinB)
  t.throws(function() {
    var linkB = graph.linkPins(pinA, pinB)
  })

  var links = graph.getLinksFrom(pinA)
  t.equal(links.length, 1, 'should only link once')
  t.end()
})
