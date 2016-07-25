'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const ReactiveGraph = require('./lib/reactivegraph');

module.exports = function (_ReactiveGraph) {
  _inherits(Graph, _ReactiveGraph);

  function Graph() {
    _classCallCheck(this, Graph);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Graph).apply(this, arguments));
  }

  _createClass(Graph, [{
    key: 'load',
    value: function load(data) {
      return Graph.load(this, data);
    }
  }], [{
    key: 'load',
    value: function load(graph, data) {
      data = graph.createData(data);

      for (let nodeID in data.nodes) {
        const node = data.nodes[nodeID];
        if (!graph.hasNode(node)) {
          graph.addNode(node);
        }
      }

      for (let pinID in data.pins) {
        const pin = data.pins[pinID];
        if (!graph.hasPin(pin)) graph.addPin(pin.nodeID, pin);
      }

      for (let linkID in data.links) {
        const link = data.links[linkID];
        if (!graph.hasLink(link)) graph.linkPins(link.from, link.to, link);
      }
    }
  }]);

  return Graph;
}(ReactiveGraph);