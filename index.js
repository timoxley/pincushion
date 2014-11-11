require('./nodepins')
var Reactive = require('./reactive')
var load = require('./load')
Reactive.prototype.load = function(data) {
  return load(this, data)
}
module.exports = Reactive
