var tape = require('tape')
var memdb = require('memdb')
var temp = require('./')

tape('is empty', function (t) {
  t.plan(4)

  var db = memdb()
  var tmp = temp(db)

  var a = tmp()

  a.put('hello', 'world', function () {
    a.createReadStream()
      .on('data', function (data) {
        t.same(data.key, 'hello')
        t.same(data.value, 'world')
      })
  })

  var b = tmp()

  b.put('hej', 'verden', function () {
    b.createReadStream()
      .on('data', function (data) {
        t.same(data.key, 'hej')
        t.same(data.value, 'verden')
      })
  })
})

tape('empty after restart', function (t) {
  var db = memdb()
  var tmp = temp(db)

  var a = tmp()

  a.put('hello', 'world', function () {
    a.get('hello', function (err, val) {
      t.same(val, 'world', 'inserted value')
      a.close(function () {
        var b = temp(db)() // same as restart

        b.get('hello', function (err, value) {
          t.notOk(value, 'hello not in there')

          b.createReadStream()
            .on('data', function () {
              t.notOk('not empty')
            })
            .on('end', function () {
              t.end()
            })
        })
      })
    })
  })
})

tape('clears on open', function (t) {
  var db = memdb()
  var tmp = temp(db)

  db.put('!test!hello', 'muhahah', function () {
    var a = tmp('test')

    a.get('hello', function (err, value) {
      t.notOk(value, 'value was removed')
      db.get('!test!hello', function (err, value) {
        t.notOk(value, 'value was removed')
        t.end()
      })
    })
  })
})
