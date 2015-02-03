var tempdown = require('./leveldown')
var levelup = require('levelup')
var xtend = require('xtend')

var temp = function (db, opts) {
  if (typeof opts === 'string') opts = {prefix: opts}
  if (!opts) opts = {}

  var tick = 0
  var separator = opts.separator || opts.sep || '!'
  var prefix = opts.prefix ? separator + opts.prefix + separator : ''
  delete opts.prefix

  return function (tmpOpts) {
    if (typeof tmpOpts === 'string') tmpOpts = {prefix: tmpOpts}
    tmpOpts = xtend(opts, tmpOpts)
    tmpOpts.db = function () {
      return tempdown(db, prefix + (tmpOpts.prefix || (++tick).toString(16)), separator)
    }

    return levelup(db.location, tmpOpts)
  }
}

module.exports = temp
