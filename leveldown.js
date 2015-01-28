var SubDOWN = require('subleveldown/leveldown')
var util = require('util')

var noop = function () {}

var TempDOWN = function (db, prefix, separator) {
  if (!(this instanceof TempDOWN)) return new TempDOWN(db, prefix, separator)
  SubDOWN.call(this, db, prefix, separator)
}

util.inherits(TempDOWN, SubDOWN)

var clear = function (down, cb) {
  var ite = down.iterator({keys: true, values: false, limit: -1})

  var end = function (err) {
    ite.end(function () {
      cb(err)
    })
  }

  var del = function (err) {
    if (err) return end(err)
    ite.next(loop)
  }

  var loop = function (err, key) {
    if (err) return end(err)
    if (!key) return end()
    down.del(key, del)
  }

  ite.next(loop)
}

TempDOWN.prototype.open = function (opts, cb) {
  if (typeof opts === 'function') return this.open(null, cb)
  if (!opts) opts = {}
  if (!cb) cb = noop

  var self = this
  SubDOWN.prototype.open.call(this, opts, function (err) {
    if (err) return cb(err)
    clear(self, cb)
  })
}

TempDOWN.prototype.close = function (cb) {
  if (!cb) cb = noop

  var self = this
  clear(this, function (err) {
    if (err) return cb(err)
    SubDOWN.prototype.close.call(self, cb)
  })
}

module.exports = TempDOWN
