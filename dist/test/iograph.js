const test = require('tape');

const IOGraph = require('../lib/iograph');

test('createOutputPin creates output pins', t => {
  const pin = IOGraph.createOutputPin();
  t.ok(pin);
  t.equal(pin.direction, IOGraph.OUTPUT);
  t.end();
});

test('createInputPin creates input pins', t => {
  const pin = IOGraph.createInputPin();
  t.ok(pin);
  t.equal(pin.direction, IOGraph.INPUT);
  t.end();
});

test('addNode can handle non-writable, non-enumerable id', t => {
  const graph = new IOGraph();
  const baseData = {};
  Object.defineProperty(baseData, 'id', {
    configurable: false,
    enumerable: false,
    get() {
      return 1;
    }
  });

  const node = graph.addNode(baseData);
  t.ok(node);
  t.equal(node.id, baseData.id);
  t.end();
});

test('addOutputPin creates output pins', t => {
  const graph = new IOGraph();
  const node = graph.addNode();
  const pin = graph.addOutputPin(node.id);
  t.ok(pin);
  t.equal(pin.direction, IOGraph.OUTPUT);
  t.end();
});

test('addInputPin creates input pins', t => {
  const graph = new IOGraph();
  const node = graph.addNode();
  const pin = graph.addInputPin(node.id);
  t.ok(pin);
  t.equal(pin.direction, IOGraph.INPUT);
  t.end();
});

test('isOutputPin matches output pins', t => {
  const graph = new IOGraph();
  const node = graph.addNode();
  const inputPin = graph.addInputPin(node.id);
  const outputPin = graph.addOutputPin(node.id);
  t.ok(graph.isOutputPin(outputPin));
  t.ok(graph.isOutputPin(outputPin.id));
  t.notOk(graph.isOutputPin(inputPin));
  t.notOk(graph.isOutputPin(inputPin.id));
  t.end();
});

test('isInputPin matches input pins', t => {
  const graph = new IOGraph();
  const node = graph.addNode();
  const inputPin = graph.addInputPin(node.id);
  const outputPin = graph.addOutputPin(node.id);

  t.ok(graph.isInputPin(inputPin));
  t.ok(graph.isInputPin(inputPin.id));
  t.notOk(graph.isInputPin(outputPin));
  t.notOk(graph.isInputPin(outputPin.id));
  t.end();
});

test('getNodeOutputPins gets output pins', t => {
  const graph = new IOGraph();
  const node = graph.addNode();
  const pin1 = graph.addOutputPin(node.id);
  const pin2 = graph.addOutputPin(node.id);
  graph.addInputPin(node.id);

  // should not include pin3 as it's an input
  t.deepEqual(graph.getNodeOutputPins(node.id), [pin1, pin2]);
  t.end();
});

test('getNodeInputPins gets input pins', t => {
  const graph = new IOGraph();
  const node = graph.addNode();
  const pin1 = graph.addInputPin(node.id);
  const pin2 = graph.addInputPin(node.id);
  graph.addOutputPin(node.id);

  // should not include pin3 as it's an output
  t.deepEqual(graph.getNodeInputPins(node.id), [pin1, pin2]);
  t.end();
});

test('getLinkForInputPin gets single link for input pin', t => {
  const graph = new IOGraph();
  const nodeA = graph.addNode();
  const nodeB = graph.addNode();
  const outputPin = graph.addOutputPin(nodeA);
  const inputPin = graph.addInputPin(nodeB);

  const expected = graph.linkPins(outputPin, inputPin);
  const actual = graph.getLinkForInputPin(inputPin);
  t.equal(expected, actual);
  t.end();
});

test('getLinkForInputPin throws if if no link for input pin', t => {
  const graph = new IOGraph();
  const nodeA = graph.addNode();
  const nodeB = graph.addNode();
  graph.addOutputPin(nodeA);
  const inputPin = graph.addInputPin(nodeB);
  t.throws(() => {
    graph.getLinkForInputPin(inputPin);
  });
  t.end();
});

test('IOGraph ensures output pins can be connected to input pins', t => {
  const graph = new IOGraph();
  const nodeA = graph.addNode();
  const pinA = graph.addOutputPin(nodeA.id);

  const nodeB = graph.addNode();
  const pinB = graph.addInputPin(nodeB.id);

  graph.linkPins(pinA.id, pinB.id);
  t.deepEqual(graph.getPinsFrom(pinA.id), [pinB], 'should have linked from');
  t.deepEqual(graph.getPinsTo(pinB.id), [pinA], 'should have linked to');
  t.end();
});

test('IOGraph ensures output pins are connected to input pins', t => {
  const graph = new IOGraph();
  const nodeA = graph.addNode();
  const pinA = graph.addOutputPin(nodeA.id);

  const nodeB = graph.addNode();
  const pinB = graph.addOutputPin(nodeB.id);

  t.throws(() => {
    graph.linkPins(pinA.id, pinB.id);
  });

  t.deepEqual(graph.getPinsFrom(pinA.id), [], 'should not have linked from');
  t.deepEqual(graph.getPinsTo(pinB.id), [], 'should not have linked to');
  t.end();
});

test('IOGraph ensures only single connections to input pins', t => {
  const graph = new IOGraph();
  const nodeA = graph.addNode();
  const outputA = graph.addOutputPin(nodeA);
  const outputB = graph.addOutputPin(nodeA);

  const nodeB = graph.addNode();
  const inputPin = graph.addInputPin(nodeB);

  graph.linkPins(outputA, inputPin);
  t.throws(() => {
    graph.linkPins(outputB, inputPin);
  });

  t.deepEqual(graph.getPinsFrom(outputA), [inputPin], 'should have linked from');
  t.deepEqual(graph.getPinsFrom(outputB), [], 'should not have linked already linked');
  t.deepEqual(graph.getPinsTo(inputPin), [outputA], 'should have linked to');
  t.end();
});

test('IOGraph pins must have direction', t => {
  const graph = new IOGraph();
  const nodeA = graph.addNode();

  t.throws(() => {
    graph.addPin(nodeA.id);
  });
  t.end();
});