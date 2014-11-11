var test = require('tape')

var Graph = require('../graph')

test('createData creates graph data', function(t) {
  var data = Graph.createData()
  t.ok(data, 'created graph')
  t.ok(data.nodes, 'graph has nodes')
  t.ok(data.pins, 'graph has pins')
  t.end()
})

test('createNode creates node', function(t) {
  var node = Graph.createNode()
  t.ok(node, 'created node')
  t.ok(node.id, 'node has id')
  t.end()
})

test('can add and get nodes', function(t) {
  var graph = new Graph()

  var node = {
    id: '12345678'
  }

  graph.addNode(node)

  var nodes = graph.getNodes()
  t.deepEqual(nodes, [node], 'got added nodes')
  t.end()
})

test('addNode will error if no data', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  t.ok(node.id)
  t.end()
})

test('addNode returns node', function(t) {
  var graph = new Graph()
  var node = Graph.createNode()
  t.equal(graph.addNode(node), node)
  t.end()
})

test('addNode will create a new node', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  t.ok(node)
  t.ok(node.id)
  t.end()
})

test('addNode will error if node exists', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  t.throws(function() {
    graph.addNode(node)
  })
  t.end()
})

//test('updateNode will update a node', function(t) {
  //var graph = new Graph()
  //var node = graph.addNode()
  //t.ok(node)
  //var update = {
    //id: node.id
  //}
  //var updatedNode = graph.updateNode(update)
  //t.deepEqual(node.id, updatedNode.id)
  //t.end()
//})

//test('updateNode will error if node not exists', function(t) {
  //var graph = new Graph()
  //t.throws(function() {
    //graph.updateNode({id: 'asdasd'})
  //})
  //t.end()
//})

test('getNode can get node', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  t.deepEqual(graph.getNode(node.id), node)
  t.end()
})

test('getNode will error if node not added', function(t) {
  var graph = new Graph()
  t.throws(function() {
    graph.getNode('abhkabkdhk')
  })
  t.end()
})

test('hasNode will true if has node', function(t) {
  var graph = new Graph()
  var node = graph.createNode()
  t.ok(!graph.hasNode('abhkabkdhk'))
  graph.addNode(node)
  t.ok(graph.hasNode(node.id))
  t.end()
})

test('removeNode will remove node', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  t.ok(graph.hasNode(node.id))
  var result = graph.removeNode(node.id)
  t.equals(result, node)
  t.ok(!graph.hasNode(node.id))
  t.end()
})

test('removeNode will throw if no node', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  t.throws(function() {
    graph.removeNode('hbbhkkb')
  })
  t.end()
})

test('removeNode will remove node pins', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = graph.addPin(node.id)
  graph.removeNode(node.id)
  t.ok(!graph.hasPin(pin.id))
  t.end()
})

test('addPin will add pin to node', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = Graph.createPin()
  t.ok(pin)
  graph.addPin(node.id, pin)
  t.ok(pin.id)
  t.deepEqual(graph.getNodePins(node.id), [pin])
  t.end()
})

test('addPin will add pin to node by object', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = Graph.createPin()
  t.ok(pin)
  graph.addPin(node, pin)
  t.ok(pin.id)
  t.deepEqual(graph.getNodePins(node.id), [pin])
  t.end()
})

test('getNodePins can get pins by node object', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = graph.addPin(node)
  t.deepEqual(graph.getNodePins(node), [pin])
  t.end()
})

test('addPin will add pin to node', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var nodeB = graph.addNode()
  var pinA = Graph.createPin()
  graph.addPin(nodeA.id, pinA)
  var pinB = graph.addPin(nodeB.id)
  t.deepEqual(graph.getPins(), [pinA, pinB])
  t.end()
})

test('getPin can get pin', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = graph.addPin(node.id)
  t.equal(graph.getPin(pin.id), pin)
  t.end()
})

test('hasPin true iff has pin', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = graph.addPin(node.id)
  t.ok(graph.hasPin(pin.id))
  t.ok(!graph.hasPin(Graph.createPin()))
  t.end()
})

test('removePin will remove pin', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = graph.addPin(node.id)
  t.ok(graph.hasPin(pin.id))
  var result = graph.removePin(pin.id)
  t.ok(!graph.hasPin(pin.id))
  t.equal(result, pin)
  t.end()
})

test('removePin will throw if no pin', function(t) {
  var graph = new Graph()
  t.throws(function() {
    graph.removePin('hbbhkkb')
  })
  t.end()
})

test('getNodeForPin can get node for a pin', function(t) {
  var graph = new Graph()
  var node = graph.addNode()
  var pin = graph.addPin(node)
  t.deepEqual(graph.getNodeForPin(pin), node)
  t.end()
})

test('link can link pins', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  var link = graph.linkPins(pinA.id, pinB.id)

  t.deepEqual(graph.getPinsFrom(pinA.id), [pinB], 'get pins from')
  t.deepEqual(graph.getPinsTo(pinB.id), [pinA], 'get pins to')
  t.end()
})

test('link/getPinsFrom/getPinsTo can link pins with object as well as id', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  graph.linkPins(pinA, pinB)

  t.deepEqual(graph.getPinsFrom(pinA), [pinB], 'get pins from')
  t.deepEqual(graph.getPinsTo(pinB), [pinA], 'get pins to')
  t.end()
})

test('can link to multiple pins', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)
  var pinC = graph.addPin(nodeB.id)

  graph.linkPins(pinA, pinB)
  graph.linkPins(pinA, pinC)

  t.deepEqual(graph.getPinsFrom(pinA), [pinB, pinC], 'get pins from')
  t.deepEqual(graph.getPinsTo(pinB), [pinA], 'get pins to')
  t.deepEqual(graph.getPinsTo(pinC), [pinA], 'get pins to')
  t.end()
})

test('getLinksFrom get links from pin', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  t.deepEqual(graph.getLinksFrom(pinA), [], 'getLinksFrom')
  t.deepEqual(graph.getLinksFrom(pinB), [], 'getLinksFrom')
  var link = graph.linkPins(pinA, pinB)
  t.deepEqual(graph.getLinksFrom(pinA), [link], 'getLinksFrom')
  t.deepEqual(graph.getLinksFrom(pinB), [], 'getLinksFrom')

  t.end()
})

test('hasLinksFrom if links from pin', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  t.notOk(graph.hasLinksFrom(pinA), 'hasLinksFrom')
  t.notOk(graph.hasLinksFrom(pinB), 'hasLinksFrom')
  var link = graph.linkPins(pinA, pinB)
  t.ok(graph.hasLinksFrom(pinA), 'hasLinksFrom')
  t.notOk(graph.hasLinksFrom(pinB), 'hasLinksFrom')

  t.end()
})

test('getLinksTo get links to pin', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  t.deepEqual(graph.getLinksTo(pinA), [], 'getLinksTo')
  t.deepEqual(graph.getLinksTo(pinB), [], 'getLinksTo')
  var link = graph.linkPins(pinA, pinB)
  t.deepEqual(graph.getLinksTo(pinA), [], 'getLinksTo')
  t.deepEqual(graph.getLinksTo(pinB), [link], 'getLinksTo')

  t.end()
})

test('hasLinksTo if links to pin', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  t.notOk(graph.hasLinksTo(pinA), 'hasLinksTo')
  t.notOk(graph.hasLinksTo(pinB), 'hasLinksTo')
  graph.linkPins(pinA, pinB)
  t.ok(graph.hasLinksTo(pinB), 'hasLinksTo')
  t.notOk(graph.hasLinksTo(pinA), 'hasLinksTo')

  t.end()
})

test('link contains metadata', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  graph.linkPins(pinA, pinB, {
    hello: 'world'
  })
  var links = graph.getLinksFrom(pinA.id)
  t.equal(links[0].from, pinA.id)
  t.equal(links[0].to, pinB.id)
  t.equal(links[0].hello, 'world')
  t.end()
})

test('getLink can get link by id', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  var linkA = graph.linkPins(pinA, pinB)
  t.equal(graph.getLink(linkA.id), linkA)
  t.end()
})

test('getLink can get link by object', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  var linkA = graph.linkPins(pinA, pinB)
  t.equal(graph.getLink(linkA), linkA)
  t.end()
})

test('getLink will throw if no link', function(t) {
  var graph = new Graph()
  t.throws(function() {
    graph.getLink('asdad')
  })
  t.end()
})

test('getLinkFromTo gets link from one pin to another', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)
  var pinC = graph.addPin(nodeB.id)

  var linkA = graph.linkPins(pinA, pinB)
  var linkC = graph.linkPins(pinA, pinC)

  t.deepEqual(graph.getLinkFromTo(pinA, pinB), linkA)
  t.end()
})

test('unlink will remove link between pins', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)
  var pinC = graph.addPin(nodeB.id)

  var linkA = graph.linkPins(pinA, pinB)
  var linkC = graph.linkPins(pinA, pinC)
  var unlinked = graph.unlinkPins(pinA, pinB)
  t.deepEqual(graph.getLinkFromTo(pinA, pinB), undefined, 'get pins from A')
  t.deepEqual(unlinked, linkA, 'get pins from A')
  t.deepEqual(graph.getLinkFromTo(pinA, pinC), linkC, 'get pins from A')
  t.end()
})

test('removeLink will remove link', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  var link = graph.linkPins(pinA.id, pinB.id)
  t.ok(graph.hasLink(link.id))
  graph.removeLink(link.id)
  t.ok(!graph.hasLink(link.id))
  t.end()
})

test('removePin will remove links', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  var link = graph.linkPins(pinA.id, pinB.id)

  t.ok(graph.hasLink(link.id))
  graph.removePin(pinA.id)
  t.ok(!graph.hasLink(link.id))
  t.end()
})

test('removeNode will remove links', function(t) {
  var graph = new Graph()
  var nodeA = graph.addNode()
  var pinA = graph.addPin(nodeA.id)

  var nodeB = graph.addNode()
  var pinB = graph.addPin(nodeB.id)

  var link = graph.linkPins(pinA.id, pinB.id)

  t.ok(graph.hasLink(link.id))
  graph.removeNode(nodeA.id)
  t.ok(!graph.hasLink(link.id))
  t.end()
})

