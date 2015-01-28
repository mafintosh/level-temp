# level-temp

Create a temporary sublevel that is guaranteed to be empty.

```
npm install level-temp
```

## Usage

``` js
var temp = require('level-temp')
var tmp = temp(db) // where db is a levelup

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
```

If you explicitly close the tmp database (using `tmpDb.close()`) the contents will
be removed. If you restart your application previous tmp data will be overriden as well.

## API

#### `tmp = temp(db, [options])`

Create a new temporary sublevel generator. Options are used as default for any tmp databases created afterwards.
Optionally you can set `prefix` to a string that will prefix all tmp sublevels created.

``` js
var tmp = temp(db, {valueEncoding: 'json'}) // set valueEncoding: json all tmp sublevels
```

#### `var tmpDb = tmp([options])`

Create a new temporary sublevel.

Any `options` passed here are forwarded to [levelup](https://gihub.com/rvagg/node-levelup)
with the default values from the `temp` constructor mixed in.

Per default an increasing number is used to prefix the temporary sublevels.
To change this set the `prefix` to whatever string you want to use as a prefix.

The returned `tmpDb` is a regular levelup that will have its contents garbage collected when you call `tmpDb.close()`
or at some point in the future when the temporary sublevel prefix is being reused.

## License

MIT
