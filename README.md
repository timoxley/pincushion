# pincushion

Data structures for a visual-programming-esque interface.

## API

* `Graph()`
* `load(data)`
* `createData(data = {})`

## Nodes

* `addNode(node)`
* `removeNode(node)`
* `getNode(nodeID)`
* `hasNode(nodeID)`
* `getNodes()`
* `createNode(data)`

### Pins

* `addPin(nodeID, pin)`
* `removePin(pin)`
* `getPins()`
* `getPin(pinID)`
* `hasPin(pinID)`
* `getNodePins(nodeID)`
* `getPinsFrom(fromPinID)`
* `getPinsTo(toPinID)`
* `getNodeForPin(pinID)`
* `createPin(data)`

### I/O Pins

* `createInputPin(pinData)`
* `createOutputPin(pinData)`
* `addInputPin(nodeID, pinData)`
* `addOutputPin(nodeID, pinData)`
* `getNodeInputPins(nodeID)`
* `getNodeOutputPins(nodeID)`
* `isInputPin(pinID)`
* `isOutputPin(pinID)`

### Links

* `addLink(link)`
* `removeLink(link)`
* `linkPins(fromID, toID, link)`
* `unlinkPins(fromPinID, toPinID)`
* `getLinks()`
* `getAllLinksFor(pinID)`
* `getLink(linkID)`
* `hasLink(linkID)`
* `getLinksFrom(fromPinID)`
* `hasLinksFrom(fromPinID)`
* `getLinksTo(toPinID)`
* `hasLinksTo(toPinID)`
* `getLinkFromTo(fromPinID, toPinID)`
* `createLink(data)`

### I/O Links

* `getLinkForInputPin(pinID)`

## License

MIT
