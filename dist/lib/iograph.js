'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const assert = require('assertf');
const Graph = require('../lib/graph');

let IOGraph = function (_Graph) {
  _inherits(IOGraph, _Graph);

  function IOGraph() {
    _classCallCheck(this, IOGraph);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(IOGraph).apply(this, arguments));
  }

  _createClass(IOGraph, [{
    key: 'createInputPin',
    value: function createInputPin(pinData) {
      return IOGraph.createInputPin(pinData);
    }
  }, {
    key: 'createOutputPin',
    value: function createOutputPin(pinData) {
      return IOGraph.createOutputPin(pinData);
    }
  }, {
    key: 'addOutputPin',
    value: function addOutputPin(nodeID, pinData) {
      return this.addPin(nodeID, this.createOutputPin(pinData));
    }
  }, {
    key: 'addInputPin',
    value: function addInputPin(nodeID, pinData) {
      return this.addPin(nodeID, this.createInputPin(pinData));
    }
  }, {
    key: 'getNodeOutputPins',
    value: function getNodeOutputPins(nodeID) {
      return this.getNodePins(nodeID).filter(pin => pin.direction === IOGraph.OUTPUT);
    }
  }, {
    key: 'getNodeInputPins',
    value: function getNodeInputPins(nodeID) {
      return this.getNodePins(nodeID).filter(pin => pin.direction === IOGraph.INPUT);
    }
  }, {
    key: 'isInputPin',
    value: function isInputPin(pinID) {
      const pin = this.getPin(id(pinID));
      return pin.direction === IOGraph.INPUT;
    }
  }, {
    key: 'isOutputPin',
    value: function isOutputPin(pinID) {
      const pin = this.getPin(id(pinID));
      return pin.direction === IOGraph.OUTPUT;
    }
  }, {
    key: 'getLinkForInputPin',
    value: function getLinkForInputPin(pinID) {
      const pin = this.getPin(pinID);
      const link = this.getLinksTo(pin).pop();
      assert.ok(link, 'IOGraph.getLinkForInput: input pin must have an incoming link!');
      return link;
    }
  }, {
    key: 'addPin',
    value: function addPin(nodeID, pinData) {
      assert.ok(pinData.direction, 'IOGraph.addPin: pin must have direction');
      return _get(Object.getPrototypeOf(IOGraph.prototype), 'addPin', this).call(this, nodeID, pinData);
    }
  }, {
    key: 'linkPins',
    value: function linkPins(fromID, toID, link) {
      const from = this.getPin(fromID);
      const to = this.getPin(toID);
      assert.ok(this.isOutputPin(from), 'IOGraph.linkPins: from must be an output: %o', from);
      assert.ok(this.isInputPin(to), 'IOGraph.linkPins: to must be an input: %o', to);

      const linksTo = this.getLinksTo(to);
      assert.equal(linksTo.length, 0, 'Inputs may only have a single link.');
      return _get(Object.getPrototypeOf(IOGraph.prototype), 'linkPins', this).call(this, fromID, toID, link);
    }
  }, {
    key: 'addNode',
    value: function addNode(config = {}) {
      config = Object.assign(config, Object.assign({
        inputs: [],
        outputs: []
      }, config));

      const node = _get(Object.getPrototypeOf(IOGraph.prototype), 'addNode', this).call(this, config);
      node.inputs = node.inputs.map(pin => {
        if (typeof pin === 'string') return pin;
        return this.addInputPin(node.id, pin).id;
      });
      node.outputs = node.outputs.map(pin => {
        if (typeof pin === 'string') return pin;
        return this.addOutputPin(node.id, pin).id;
      });

      return node;
    }
  }], [{
    key: 'createInputPin',
    value: function createInputPin(pinData = {}) {
      pinData = IOGraph.create(IOGraph.INPUT, Object.assign(pinData, Object.assign({}, {
        direction: IOGraph.INPUT
      }, pinData)));

      return this.createPin(pinData);
    }
  }, {
    key: 'createOutputPin',
    value: function createOutputPin(pinData = {}) {
      pinData = IOGraph.create(IOGraph.OUTPUT, Object.assign(pinData, Object.assign({}, {
        direction: IOGraph.OUTPUT
      }, pinData)));

      return this.createPin(pinData);
    }
  }]);

  return IOGraph;
}(Graph);

IOGraph.INPUT = IOGraph.prototype.INPUT = 'input-pin';

IOGraph.OUTPUT = IOGraph.prototype.OUTPUT = 'output-pin';

module.exports = IOGraph;

function id(objID) {
  if (objID && objID.id) return objID.id;
  return objID;
}