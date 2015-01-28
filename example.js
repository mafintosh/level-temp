var memdb = require('memdb')
var temp = require('./')
var tmp = temp(memdb()) // where db is a levelup

// call tmp to get a temporary sublevel that is empty

var a = tmp()

a.put('hello', 'world', function () {
  a.createReadStream()
    .on('data', function (data) {
      console.log('a has only one', data)
    })
})

// call tmp again to get another empty sublevel
var b = tmp()

b.put('hej', 'verden', function () {
  b.createReadStream()
    .on('data', function (data) {
      console.log('b has only one', data)
    })
})
