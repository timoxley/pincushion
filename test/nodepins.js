const test = require('tape')
const Graph = require('../lib/iograph')

test('if node has inputs on add, input pins are added', t => {
  const graph = new Graph()
  const node = graph.addNode({
    inputs: [{name: 'pin1'}, {name: 'pin2'}]
  })
  t.ok(node)
  const pins = graph.getNodeInputPins(node)
  t.equal(pins.length, 2)
  t.equal(pins[0].name, 'pin1')
  t.equal(pins[1].name, 'pin2')
  t.equal(node.inputs[0], pins[0].id)
  t.equal(node.inputs[1], pins[1].id)
  t.end()
})

test('if node has outputs on add, output pins are added', t => {
  const graph = new Graph()
  const node = graph.addNode({
    outputs: [{name: 'pin1'}, {name: 'pin2'}]
  })
  const pins = graph.getNodeOutputPins(node)
  t.equal(pins.length, 2)
  t.equal(pins[0].name, 'pin1')
  t.equal(pins[1].name, 'pin2')

  t.equal(node.outputs[0], pins[0].id)
  t.equal(node.outputs[1], pins[1].id)
  t.end()
})

test('if node has inputs and outputs on add, pins are added', t => {
  const graph = new Graph()
  const node = graph.addNode({
    inputs: [{name: 'pin1'}],
    outputs: [{name: 'pin2'}]
  })

  const inputs = graph.getNodeInputPins(node)
  t.equal(inputs.length, 1)
  t.equal(inputs[0].name, 'pin1')

  const outputs = graph.getNodeOutputPins(node)
  t.equal(outputs.length, 1)
  t.equal(outputs[0].name, 'pin2')

  t.equal(node.inputs[0], inputs[0].id)
  t.equal(node.outputs[0], outputs[0].id)
  t.end()
})
