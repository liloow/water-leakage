# Leak Detector

## Instructions

-   [x] Be able to detect leaks
-   [x] Make the algorithm independant of the data structure
-   [x] Be able to treat other events

## Usage

**Detect leaks :**

```js
// Import data, class and add syntax sugar

const consumH = require('./hourly_consumption.json');
const Report = require('./class/Report');
const api = (...args) => new Report(...args);

// Initialize instance

api(consumH, (c, x) => x > 15, 3, 1, 'consommation').report();
```

1.  The first argument is the `input data`
2.  The second argument is a `function` representing the `pattern` we are looking for. **Important** : to be able to use a higher scoped cache inside the pattern statement, we use a first argument `c` referencing the cache.
3.  The third argument is the `treshold` which represent the `number of days` necessary for an event to be flagged.
4.  The fourth argument is the `cycle` which represent the `frequency` of checking (Every how many hours we should check)

**These are the mandatory arguments**

5.  The fifth argument is an optional argument representing the `key` to look for in `data`

The function accepts data in the following form:

```js
const data = {
    data: Object, // Or an Array of the relevant data or a comma sepearted string of the values
    dataKeyToTest: String,
    pattern: Function, // Args are (cache, [data])
    treshold: Number,
    cycle: Number,
};
new Report(data);
// OR
data; // as an Object or an Array of the relevant data or a comma sepearted string of the values;
const config = {
    dataKeyToTest: String,
    pattern: Function,
    treshold: Number,
    cycle: Number,
};
new Report(data, config);
// OR
new Report(data, pattern, treshold, cycle, dataKeyToTest, refiner);
// data can be an object or an Array of the relevant data or a comma sepearted string of the values
```

## Extras

```js
data, pattern, treshold, cycle, (dataKeyToTest = null), (refiner = null), (subset = null);
```

This is the full list of arguments you can pass to the class:

The `refiner` is an `object` used to refine the data in order to pick only a portion we want. It is contructed as such: `{key: value}`

The `key` can either be `per` which is a special value allowing us to repack the data by `value` (thus the key must exist on the data object ) or `The refiner must be an Object with properties mirroring the ones to refine on the data` meaning that the `key` must also exist on the data object but this time, `value` is an `Array` with `[SubstetStart, SubsetEnd]`
**Quick Note**: if the data to be refined is in hours: set the `[SubstetStart, SubsetEnd]` with an `h` => `[8h, 15h]`.

_An example for each case is available in the tests._

In the normal usecase, the pattern returns a `boolean` indicating if the entry matches said pattern and the execution tree is `QUALI` (for qualitative). In addition to that, if the pattern returns a number, the tree is `QUANTI` (quantitative) and can be used to return meaningful insight (like the average consumption) on the dataset.

_An example returning the aveage is available in the tests_

There are times where finding a leak aftewards is not the best option. Therefore, we can set a server that will listen to the api flux and report on a slack channel in realtime as soon as a leak is detected.
To launch the server :

```bash
npm start
```

It will listen to `POST` requests done on `http://localhost:3000` for the data. Here, as the data structure is supposed to be consistent, it must be in the form of :

```js
[
    {
        jour: Number,
        heure: Number,
        comsomation: Number,
    },
];
```

To test the server, launch it and run `node mockStream`

It is possible to configure the server to change its sensibility with :

```js
// REQUEST
method: 'POST';
url: 'http://localhost:3000/setSensibility';
// DATA
req.body = {
    treshold: Number,
    cycle: Number,
    limit: Number,
};
```

To check the current status of the server, a simple `GET` request to `http://localhost:3000` will do the trick.

## Internals

### Modules

The class is divided into modules :

1.  **Report** : this is the module which parses the arguments and expose the `report` method to the user.
2.  **DataExtractor** : this is the module where the `data` argument is checked in every way in order to extract the relevant part used by the `DataProcessing` module. *This module is pretty ugly but that's the price to pay if you want to match many arguments patterns*
3.  **DataProcessing** : this is the module where the data set is checked against the pattern. It is subdivided into the two trees : `QUANTI` and `QUALI`.
4.  **Context** : this is the module containing the generic methods and the private variables initialization used by the environment.
5.  **Common** : this is just a wrapper.
6.  **Watcher** : this is the module which is gonna hande the server related interactions

### Tests

The file `test.js` is testing patterns. This is a good source for examples

### Server

1.  `app.js` is the main express server file.
2.  `index.js` is the instantiation of the `Watcher` class.
3.  `mockStream.js` is a directly called function simulating a real data stream (with the interval set at 10s and not an hour).
