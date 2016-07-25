var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const IOGraph = require('../lib/iograph');
const Signal = require('signalfn');
const d = require('d');

let ReactiveGraph = function (_IOGraph) {
  _inherits(ReactiveGraph, _IOGraph);

  function ReactiveGraph(data) {
    _classCallCheck(this, ReactiveGraph);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactiveGraph).call(this, data));

    Object.defineProperties(_this, {
      onAddNode: d(Signal()),
      onRemoveNode: d(Signal()),
      onAddPin: d(Signal()),
      onRemovePin: d(Signal()),
      onAddLink: d(Signal()),
      onRemoveLink: d(Signal())
    });
    return _this;
  }

  _createClass(ReactiveGraph, [{
    key: 'addNode',
    value: function addNode(node) {
      node = _get(Object.getPrototypeOf(ReactiveGraph.prototype), 'addNode', this).call(this, node);
      this.onAddNode.fire(node);
      return node;
    }
  }, {
    key: 'removeNode',
    value: function removeNode(node) {
      node = _get(Object.getPrototypeOf(ReactiveGraph.prototype), 'removeNode', this).call(this, node);
      this.onRemoveNode.fire(node);
      return node;
    }
  }, {
    key: 'addPin',
    value: function addPin(nodeID, pin) {
      pin = _get(Object.getPrototypeOf(ReactiveGraph.prototype), 'addPin', this).call(this, nodeID, pin);
      this.onAddPin.fire(pin, this.getNode(pin.nodeID));
      return pin;
    }
  }, {
    key: 'removePin',
    value: function removePin(pin) {
      pin = _get(Object.getPrototypeOf(ReactiveGraph.prototype), 'removePin', this).call(this, pin);
      this.onRemovePin.fire(pin, this.getNode(pin.nodeID));
      return pin;
    }
  }, {
    key: 'addLink',
    value: function addLink(link) {
      link = _get(Object.getPrototypeOf(ReactiveGraph.prototype), 'addLink', this).call(this, link);
      this.onAddLink.fire(this.getPin(link.from), this.getPin(link.to), link);
      return link;
    }
  }, {
    key: 'removeLink',
    value: function removeLink(link) {
      link = _get(Object.getPrototypeOf(ReactiveGraph.prototype), 'removeLink', this).call(this, link);
      this.onRemoveLink.fire(this.getPin(link.from), this.getPin(link.to), link);
      return link;
    }
  }]);

  return ReactiveGraph;
}(IOGraph);

module.exports = ReactiveGraph;