const test = require('tape');

const Graph = require('../');

test('fires onAddNode on node add', t => {
  const graph = new Graph();
  const node = { name: 'node1' };
  graph.onAddNode(firedNode => {
    t.equal(firedNode.name, node.name);
    t.end();
  });
  graph.addNode(node);
  t.ok(node);
});

test('fires onRemoveNode on node remove', t => {
  const graph = new Graph();
  const node = { name: 'node1' };
  graph.onRemoveNode(firedNode => {
    t.equal(firedNode.name, node.name);
    t.end();
  });
  graph.addNode(node);

  graph.onAddNode(firedNode => {
    t.fail('should not fire onAddNode');
  });
  const removedNode = graph.removeNode(node);
  t.equal(removedNode, node);
});

test('fires onAddPin on pin add', t => {
  const graph = new Graph();
  const node = { name: 'node1' };
  const pin = { name: 'pin1' };

  graph.onAddPin((firedPin, firedNode) => {
    t.equal(firedPin.name, pin.name);
    t.equal(firedNode.name, node.name);
    t.end();
  });

  graph.addNode(node);
  graph.addOutputPin(node, pin);
  t.ok(pin);
});

test('fires onRemovePin on pin remove', t => {
  const graph = new Graph();
  const node = { name: 'node1' };

  graph.onRemovePin((firedPin, firedNode) => {
    t.equal(firedPin.name, pin.name);
    t.equal(firedNode.name, node.name);
    t.end();
  });

  graph.addNode(node);
  const pin = graph.addOutputPin(node, { name: 'pin1' });
  const removedPin = graph.removePin(pin);
  t.equal(removedPin, pin);
});

test('fires signal on link add', t => {
  const graph = new Graph();
  let firedLink = null;
  graph.onAddLink((firedPinFrom, firedPinTo, theFiredLink) => {
    t.equal(firedPinFrom, pinFrom);
    t.equal(firedPinTo, pinTo);
    firedLink = theFiredLink;
    t.end();
  });

  const nodeA = graph.addNode();
  const nodeB = graph.addNode();
  const pinFrom = graph.addOutputPin(nodeA);
  const pinTo = graph.addInputPin(nodeB);
  const link = graph.linkPins(pinFrom, pinTo);
  t.equal(link, firedLink);
  t.ok(link);
});

test('fires signal on link remove', t => {
  const graph = new Graph();
  graph.onRemoveLink((firedPinFrom, firedPinTo, firedLink) => {
    t.equal(firedPinFrom, pinFrom);
    t.equal(firedPinTo, pinTo);
    t.equal(firedLink, link);
    t.end();
  });

  const nodeA = graph.addNode();
  const nodeB = graph.addNode();
  const pinFrom = graph.addOutputPin(nodeA);
  const pinTo = graph.addInputPin(nodeB);
  const link = graph.linkPins(pinFrom, pinTo);
  const removedLink = graph.removeLink(link);
  t.equal(link, removedLink);
});

test('successfully removes nodes linked from', t => {
  const graph = new Graph();
  graph.onRemoveNode(firedNode => {
    t.equal(firedNode.name, nodeA.name);
    t.end();
  });

  const nodeA = graph.addNode({ name: 'nodeA' });
  const nodeB = graph.addNode({ name: 'nodeB' });
  const pinFrom = graph.addOutputPin(nodeA);
  const pinTo = graph.addInputPin(nodeB);
  graph.linkPins(pinFrom, pinTo);
  graph.removeNode(nodeA);
});

test('successfully removes nodes linked to', t => {
  const graph = new Graph();
  graph.onRemoveNode(firedNode => {
    t.equal(firedNode.name, nodeB.name);
    t.end();
  });

  const nodeA = graph.addNode({ name: 'nodeA' });
  const nodeB = graph.addNode({ name: 'nodeB' });
  const pinFrom = graph.addOutputPin(nodeA);
  const pinTo = graph.addInputPin(nodeB);
  graph.linkPins(pinFrom, pinTo);
  graph.removeNode(nodeB);
});

test('fires onRemoveLink when removing a linked node', t => {
  const graph = new Graph();
  graph.onRemoveLink((firedPinFrom, firedPinTo, firedLink) => {
    t.equal(firedPinFrom, pinFrom);
    t.equal(firedPinTo, pinTo);
    t.equal(firedLink, link);
    t.end();
  });

  const nodeA = graph.addNode();
  const nodeB = graph.addNode();
  const pinFrom = graph.addOutputPin(nodeA);
  const pinTo = graph.addInputPin(nodeB);
  const link = graph.linkPins(pinFrom, pinTo);
  graph.removeNode(nodeA);
});