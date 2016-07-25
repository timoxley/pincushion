const test = require('tape');

const Graph = require('../');

test('can load data into another graph', t => {
  t.plan(15);
  const graphA = new Graph();
  const nodeA = graphA.addNode();
  const pinA = graphA.addOutputPin(nodeA);

  const nodeB = graphA.addNode();
  const pinB = graphA.addInputPin(nodeB);

  // add some additional pins
  graphA.addInputPin(nodeB);
  graphA.addOutputPin(nodeB);

  graphA.linkPins(pinA, pinB);

  const graphB = new Graph();

  graphB.onAddNode(node => {
    t.ok(node, 'added node');
  });

  graphB.onAddPin(pin => {
    t.ok(pin, 'added pin');
  });

  graphB.onAddLink((from, to) => {
    t.equal(from.id, pinA.id, 'linked from pinA');
    t.equal(to.id, pinB.id, 'linked to pinB');
  });

  graphB.load(graphA.data);
  t.deepEqual(graphB.data, graphA.data, 'data is same');
  t.deepEqual(graphB.getNodeOutputPins(nodeB.id), graphA.getNodeOutputPins(nodeB.id), 'node B has correct output pins');

  t.deepEqual(graphB.getNodeOutputPins(nodeA.id), graphA.getNodeOutputPins(nodeA.id), 'node A has correct output pins');

  t.deepEqual(graphB.getNodeInputPins(nodeB.id), graphA.getNodeInputPins(nodeB.id), 'node B has correct input pins');

  t.deepEqual(graphB.getNodeInputPins(nodeA.id), graphA.getNodeInputPins(nodeA.id), 'node A has correct input pins');

  graphB.load(graphA.data);
  t.deepEqual(graphB.data, graphA.data, 'data is still the same');
  const graphC = new Graph();

  graphC.load(graphB.data);
  t.deepEqual(graphC.data, graphB.data, 'data is still the same');
});