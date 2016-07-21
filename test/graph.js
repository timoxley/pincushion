'use strict'

const test = require('tape')

const Graph = require('../lib/graph')

test('createData creates graph data', t => {
  const data = Graph.createData()
  t.ok(data, 'created graph')
  t.ok(data.nodes, 'graph has nodes')
  t.ok(data.pins, 'graph has pins')
  t.end()
})

test('createNode creates node', t => {
  const node = Graph.createNode()
  t.ok(node, 'created node')
  t.ok(node.id, 'node has id')
  t.end()
})

test('createNode can happily inherit existing data', t => {
  const baseData = {
    name: 'alice'
  }
  const node = Graph.createNode(baseData)
  t.ok(node, 'created node')
  t.equal(node.name, baseData.name, 'properties match')
  t.deepEqual(node, baseData, 'node and baseData are same')
  t.end()
})

test('createNode leaves existing id', t => {
  const baseData = {
    id: 99
  }
  const node = Graph.createNode(baseData)
  t.deepEqual(node, baseData, 'node and baseData are the same')
  t.end()
})

test('createNode can deal with frozen node data', t => {
  const baseData = Object.freeze({
    id: 1
  })

  const node = Graph.createNode(baseData)
  t.ok(node, 'created node')
  t.deepEqual(node, baseData, 'node and baseData are the same')
  t.end()
})

test('createLink can deal with frozen link data', t => {
  const baseData = Object.freeze({
    id: 1
  })

  const link = Graph.createLink(baseData)
  t.ok(link, 'created link')
  t.deepEqual(link, baseData, 'link and baseData are the same')
  t.end()
})

test('createPin can deal with frozen pin data', t => {
  const baseData = Object.freeze({
    id: 1
  })

  const pin = Graph.createLink(baseData)
  t.ok(pin, 'created pin')
  t.deepEqual(pin, baseData, 'pin and baseData are the same')
  t.end()
})

test('can add and get nodes', t => {
  const graph = new Graph()

  const node = {
    id: '12345678'
  }

  graph.addNode(node)

  const nodes = graph.getNodes()
  t.deepEqual(nodes, [node], 'got added nodes')
  t.end()
})

test('addNode will error if no data', t => {
  const graph = new Graph()
  const node = graph.addNode()
  t.ok(node.id)
  t.end()
})

test('addNode returns node', t => {
  const graph = new Graph()
  const node = Graph.createNode()
  t.deepEqual(graph.addNode(node), node)
  t.end()
})

test('addNode will create a new node', t => {
  const graph = new Graph()
  const node = graph.addNode()
  t.ok(node)
  t.ok(node.id)
  t.end()
})

test('addNode will error if node exists', t => {
  const graph = new Graph()
  const node = graph.addNode()
  t.throws(() => {
    graph.addNode(node)
  })
  t.end()
})

test('getNode can get node', t => {
  const graph = new Graph()
  const node = graph.addNode()
  t.deepEqual(graph.getNode(node.id), node)
  t.end()
})

test('getNode will error if node not added', t => {
  const graph = new Graph()
  t.throws(() => {
    graph.getNode('abhkabkdhk')
  })
  t.end()
})

test('hasNode will true if has node', t => {
  const graph = new Graph()
  const node = graph.createNode()
  t.ok(!graph.hasNode('abhkabkdhk'))
  graph.addNode(node)
  t.ok(graph.hasNode(node.id))
  t.end()
})

test('removeNode will remove node', t => {
  const graph = new Graph()
  const node = graph.addNode()
  t.ok(graph.hasNode(node.id))
  const result = graph.removeNode(node.id)
  t.equals(result, node)
  t.ok(!graph.hasNode(node.id))
  t.end()
})

test('removeNode will throw if no node', t => {
  const graph = new Graph()
  t.throws(() => {
    graph.removeNode('hbbhkkb')
  })
  t.end()
})

test('removeNode will remove node pins', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = graph.addPin(node.id)
  graph.removeNode(node.id)
  t.ok(!graph.hasPin(pin.id))
  t.end()
})

test('addPin will add pin to node', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = Graph.createPin()
  t.ok(pin)
  graph.addPin(node.id, pin)
  t.ok(pin.id)
  t.deepEqual(graph.getNodePins(node.id), [pin])
  t.end()
})

test('addPin will add pin to node by object', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = Graph.createPin()
  t.ok(pin)
  graph.addPin(node, pin)
  t.ok(pin.id)
  t.deepEqual(graph.getNodePins(node.id), [pin])
  t.end()
})

test('getNodePins can get pins by node object', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = graph.addPin(node)
  t.deepEqual(graph.getNodePins(node), [pin])
  t.end()
})

test('addPin will add pin to node', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const nodeB = graph.addNode()
  const pinA = Graph.createPin()
  graph.addPin(nodeA.id, pinA)
  const pinB = graph.addPin(nodeB.id)
  t.deepEqual(graph.getPins(), [pinA, pinB])
  t.end()
})

test('getPin can get pin', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = graph.addPin(node.id)
  t.equal(graph.getPin(pin.id), pin)
  t.end()
})

test('hasPin true iff has pin', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = graph.addPin(node.id)
  t.ok(graph.hasPin(pin.id))
  t.ok(!graph.hasPin(Graph.createPin()))
  t.end()
})

test('removePin will remove pin', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = graph.addPin(node.id)
  t.ok(graph.hasPin(pin.id))
  const result = graph.removePin(pin.id)
  t.ok(!graph.hasPin(pin.id))
  t.equal(result, pin)
  t.end()
})

test('removePin will throw if no pin', t => {
  const graph = new Graph()
  t.throws(() => {
    graph.removePin('hbbhkkb')
  })
  t.end()
})

test('getNodeForPin can get node for a pin', t => {
  const graph = new Graph()
  const node = graph.addNode()
  const pin = graph.addPin(node)
  t.deepEqual(graph.getNodeForPin(pin), node)
  t.end()
})

test('link can link pins', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  graph.linkPins(pinA.id, pinB.id)

  t.deepEqual(graph.getPinsFrom(pinA.id), [pinB], 'get pins from')
  t.deepEqual(graph.getPinsTo(pinB.id), [pinA], 'get pins to')
  t.end()
})

test('link/getPinsFrom/getPinsTo can link pins with object as well as id', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  graph.linkPins(pinA, pinB)

  t.deepEqual(graph.getPinsFrom(pinA), [pinB], 'get pins from')
  t.deepEqual(graph.getPinsTo(pinB), [pinA], 'get pins to')
  t.end()
})

test('can link to multiple pins', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)
  const pinC = graph.addPin(nodeB.id)

  graph.linkPins(pinA, pinB)
  graph.linkPins(pinA, pinC)

  t.deepEqual(graph.getPinsFrom(pinA), [pinB, pinC], 'get pins from')
  t.deepEqual(graph.getPinsTo(pinB), [pinA], 'get pins to')
  t.deepEqual(graph.getPinsTo(pinC), [pinA], 'get pins to')
  t.end()
})

test('getLinksFrom get links from pin', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  t.deepEqual(graph.getLinksFrom(pinA), [], 'getLinksFrom')
  t.deepEqual(graph.getLinksFrom(pinB), [], 'getLinksFrom')
  const link = graph.linkPins(pinA, pinB)
  t.deepEqual(graph.getLinksFrom(pinA), [link], 'getLinksFrom')
  t.deepEqual(graph.getLinksFrom(pinB), [], 'getLinksFrom')

  t.end()
})

test('hasLinksFrom if links from pin', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  t.notOk(graph.hasLinksFrom(pinA), 'hasLinksFrom')
  t.notOk(graph.hasLinksFrom(pinB), 'hasLinksFrom')
  graph.linkPins(pinA, pinB)
  t.ok(graph.hasLinksFrom(pinA), 'hasLinksFrom')
  t.notOk(graph.hasLinksFrom(pinB), 'hasLinksFrom')

  t.end()
})

test('getLinksTo get links to pin', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  t.deepEqual(graph.getLinksTo(pinA), [], 'getLinksTo')
  t.deepEqual(graph.getLinksTo(pinB), [], 'getLinksTo')
  const link = graph.linkPins(pinA, pinB)
  t.deepEqual(graph.getLinksTo(pinA), [], 'getLinksTo')
  t.deepEqual(graph.getLinksTo(pinB), [link], 'getLinksTo')

  t.end()
})

test('hasLinksTo if links to pin', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  t.notOk(graph.hasLinksTo(pinA), 'hasLinksTo')
  t.notOk(graph.hasLinksTo(pinB), 'hasLinksTo')
  graph.linkPins(pinA, pinB)
  t.ok(graph.hasLinksTo(pinB), 'hasLinksTo')
  t.notOk(graph.hasLinksTo(pinA), 'hasLinksTo')

  t.end()
})

test('link contains metadata', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  graph.linkPins(pinA, pinB, {
    name: 'alice'
  })
  const links = graph.getLinksFrom(pinA.id)
  t.equal(links[0].from, pinA.id)
  t.equal(links[0].to, pinB.id)
  t.equal(links[0].name, 'alice')
  t.end()
})

test('getLink can get link by id', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  const linkA = graph.linkPins(pinA, pinB)
  t.equal(graph.getLink(linkA.id), linkA)
  t.end()
})

test('getLink can get link by object', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  const linkA = graph.linkPins(pinA, pinB)
  t.equal(graph.getLink(linkA), linkA)
  t.end()
})

test('getLink will throw if no link', t => {
  const graph = new Graph()
  t.throws(() => {
    graph.getLink('asdad')
  })
  t.end()
})

test('getLinkFromTo gets link from one pin to another', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)
  const pinC = graph.addPin(nodeB.id)

  const linkA = graph.linkPins(pinA, pinB)

  graph.linkPins(pinA, pinC)

  t.deepEqual(graph.getLinkFromTo(pinA, pinB), linkA)
  t.end()
})

test('unlink will remove link between pins', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)
  const pinC = graph.addPin(nodeB.id)

  const linkA = graph.linkPins(pinA, pinB)
  const linkC = graph.linkPins(pinA, pinC)
  const unlinked = graph.unlinkPins(pinA, pinB)
  t.deepEqual(graph.getLinkFromTo(pinA, pinB), undefined, 'get pins from A')
  t.deepEqual(unlinked, linkA, 'get pins from A')
  t.deepEqual(graph.getLinkFromTo(pinA, pinC), linkC, 'get pins from A')
  t.end()
})

test('removeLink will remove link', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  const link = graph.linkPins(pinA.id, pinB.id)
  t.ok(graph.hasLink(link.id))
  graph.removeLink(link.id)
  t.ok(!graph.hasLink(link.id))
  t.end()
})

test('removePin will remove links', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  const link = graph.linkPins(pinA.id, pinB.id)

  t.ok(graph.hasLink(link.id))
  graph.removePin(pinA.id)
  t.ok(!graph.hasLink(link.id))
  t.end()
})

test('removeNode will remove links', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  const link = graph.linkPins(pinA.id, pinB.id)

  t.ok(graph.hasLink(link.id))
  graph.removeNode(nodeA.id)
  t.ok(!graph.hasLink(link.id))
  t.end()
})

test('can only link between pins once', t => {
  const graph = new Graph()
  const nodeA = graph.addNode()
  const pinA = graph.addPin(nodeA.id)

  const nodeB = graph.addNode()
  const pinB = graph.addPin(nodeB.id)

  graph.linkPins(pinA, pinB)
  t.throws(() => {
    graph.linkPins(pinA, pinB)
  })

  const links = graph.getLinksFrom(pinA)
  t.equal(links.length, 1, 'should only link once')
  t.end()
})
