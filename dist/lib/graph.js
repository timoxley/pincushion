'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const uuid = require('shortid');
const assert = require('assertf');

module.exports = function () {
  function NodeGraph(data) {
    _classCallCheck(this, NodeGraph);

    this.data = this.createData(data);
  }

  _createClass(NodeGraph, [{
    key: 'addNode',
    value: function addNode(node) {
      node = this.createNode(node);
      assert.ok(!this.hasNode(node), 'addNode: Node already added: %s.', node.id);
      this.data.nodes[node.id] = node;
      return node;
    }
  }, {
    key: 'removeNode',
    value: function removeNode(nodeID) {
      const node = this.getNode(nodeID);
      const pins = this.getNodePins(node);
      pins.forEach(pin => this.removePin(pin.id));
      delete this.data.nodes[node.id];
      return node;
    }
  }, {
    key: 'hasNode',
    value: function hasNode(nodeID) {
      nodeID = id(nodeID);
      return !!this.data.nodes[nodeID];
    }
  }, {
    key: 'getNode',
    value: function getNode(nodeID) {
      nodeID = id(nodeID);
      var node = this.data.nodes[nodeID];
      assert.ok(node, 'getNode: Node not found: %s.', nodeID);
      return node;
    }
  }, {
    key: 'getNodes',
    value: function getNodes() {
      return Object.keys(this.data.nodes).map(id => this.data.nodes[id]);
    }
  }, {
    key: 'addPin',
    value: function addPin(nodeID, pin) {
      pin = this.createPin(pin);
      assert.ok(!this.hasPin(pin), 'addPin: Pin already added: %s.', pin.id);
      this.data.pins[pin.id] = pin;
      pin.nodeID = this.getNode(nodeID).id;
      return pin;
    }
  }, {
    key: 'hasPin',
    value: function hasPin(pinID) {
      pinID = id(pinID);
      return !!this.data.pins[pinID];
    }
  }, {
    key: 'getPin',
    value: function getPin(pinID) {
      pinID = id(pinID);
      assert.ok(pinID, 'getPin: pinID required: %s.', pinID);
      const pin = this.data.pins[pinID];
      assert.ok(pin, 'getPin: Pin not found: %s.', pinID);
      return pin;
    }
  }, {
    key: 'removePin',
    value: function removePin(pinID) {
      // remove links to pin before removing pin
      this.getAllLinksFor(pinID).forEach(link => this.removeLink(link.id));

      const pin = this.getPin(pinID);
      delete this.data.pins[pin.id];
      return pin;
    }
  }, {
    key: 'getNodePins',
    value: function getNodePins(nodeID) {
      const node = this.getNode(nodeID);
      return this.getPins().filter(pin => pin.nodeID === node.id);
    }
  }, {
    key: 'getNodeForPin',
    value: function getNodeForPin(pinID) {
      const pin = this.getPin(pinID);
      return this.getNode(pin.nodeID);
    }
  }, {
    key: 'getPins',
    value: function getPins() {
      return Object.keys(this.data.pins).map(pinID => this.getPin(pinID));
    }
  }, {
    key: 'linkPins',
    value: function linkPins(fromPinID, toPinID, link) {
      link = Object.assign(this.createLink(link), {
        from: this.getPin(fromPinID).id,
        to: this.getPin(toPinID).id
      });

      return this.addLink(link);
    }
  }, {
    key: 'unlinkPins',
    value: function unlinkPins(fromPinID, toPinID) {
      const link = this.getLinkFromTo(fromPinID, toPinID);
      return this.removeLink(link);
    }
  }, {
    key: 'addLink',
    value: function addLink(link) {
      link = this.createLink(link);
      assert.ok(!this.hasLink(link), 'Link already added %s.', link.id);
      assert.ok(link.from, 'Link requires from.');
      assert.ok(link.to, 'Link requires to.');
      assert.ok(!this.getLinkFromTo(link.from, link.to), 'pins already linked: %s %s', link.from, link.to);
      this.data.links[link.id] = link;
      return link;
    }
  }, {
    key: 'hasLink',
    value: function hasLink(linkID) {
      linkID = id(linkID);
      return !!this.data.links[linkID];
    }
  }, {
    key: 'removeLink',
    value: function removeLink(linkID) {
      const link = this.getLink(linkID);
      delete this.data.links[link.id];
      return link;
    }
  }, {
    key: 'getLinkFromTo',
    value: function getLinkFromTo(fromPinID, toPinID) {
      const fromPin = this.getPin(fromPinID);
      const toPin = this.getPin(toPinID);
      return this.getLinksFrom(fromPin).find(link => link.to === toPin.id);
    }
  }, {
    key: 'getPinsFrom',
    value: function getPinsFrom(fromPinID) {
      const fromPin = this.getPin(fromPinID);
      return this.getLinksFrom(fromPin).map(link => this.getPin(link.to));
    }
  }, {
    key: 'getPinsTo',
    value: function getPinsTo(toPinID) {
      const toPin = this.getPin(toPinID);
      return this.getLinksTo(toPin).map(link => this.getPin(link.from));
    }
  }, {
    key: 'getLinks',
    value: function getLinks() {
      return Object.keys(this.data.links).map(linkID => this.getLink(linkID));
    }
  }, {
    key: 'hasLinksFrom',
    value: function hasLinksFrom(fromPinID) {
      const fromPin = this.getPin(fromPinID);
      return !!this.getLinksFrom(fromPin).length;
    }
  }, {
    key: 'hasLinksTo',
    value: function hasLinksTo(toPinID) {
      const toPin = this.getPin(toPinID);
      return !!this.getLinksTo(toPin).length;
    }
  }, {
    key: 'getLinksFrom',
    value: function getLinksFrom(fromPinID) {
      const fromPin = this.getPin(fromPinID);
      return this.getLinks().filter(link => link.from === fromPin.id);
    }
  }, {
    key: 'getLinksTo',
    value: function getLinksTo(toPinID) {
      const toPin = this.getPin(toPinID);
      return this.getLinks().filter(link => link.to === toPin.id);
    }
  }, {
    key: 'getLink',
    value: function getLink(linkID) {
      linkID = id(linkID);
      const link = this.data.links[linkID];
      assert.ok(link, 'getLink: not found: %s.', linkID);
      return link;
    }
  }, {
    key: 'getAllLinksFor',
    value: function getAllLinksFor(pinID) {
      const pin = this.getPin(pinID);
      return this.getLinksFrom(pin).concat(this.getLinksTo(pin));
    }
  }, {
    key: 'createData',
    value: function createData(data = {}) {
      data && assert.equal(typeof data, 'object', 'data must be an object: %s', data);
      return NodeGraph.createData(data);
    }
  }, {
    key: 'createNode',
    value: function createNode(data) {
      return NodeGraph.createNode(data);
    }
  }, {
    key: 'createPin',
    value: function createPin(data) {
      return NodeGraph.createPin(data);
    }
  }, {
    key: 'createLink',
    value: function createLink(data) {
      return NodeGraph.createLink(data);
    }
  }], [{
    key: 'createData',
    value: function createData(data = {}) {
      return Object.assign(data, Object.assign({}, {
        nodes: {},
        links: {},
        pins: {}
      }, data));
    }
  }, {
    key: 'create',
    value: function create(name, data = {}) {
      if ('id' in data) return data;
      return Object.assign(data, {
        id: `${ name }:${ uuid() }`
      }, data);
    }
  }, {
    key: 'createNode',
    value: function createNode(node) {
      return NodeGraph.create('node', node);
    }
  }, {
    key: 'createLink',
    value: function createLink(link) {
      return NodeGraph.create('link', link);
    }
  }, {
    key: 'createPin',
    value: function createPin(pin) {
      return NodeGraph.create('pin', pin);
    }
  }]);

  return NodeGraph;
}();

function id(objID) {
  if (objID && objID.id) return objID.id;
  return objID;
}