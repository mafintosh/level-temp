var tempdown = require('./leveldown')
var levelup = require('levelup')
var xtend = require('xtend')

var temp = function (db, opts) {
  if (!opts) opts = {}

  var tick = 0
  var separator = opts.separator || '!'
  var prefix = opts.prefix ? opts.prefix + separator : ''
  delete opts.prefix

  return function (tmpOpts) {
    tmpOpts = xtend(opts, tmpOpts)
    tmpOpts.db = function () {
      return tempdown(db, prefix + (tmpOpts.prefix || (++tick)), separator)
    }

    return levelup(db.location, tmpOpts)
  }
}

module.exports = temp
