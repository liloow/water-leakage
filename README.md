# Leak Detector

## Instructions

-   [x] Be able to detect leaks
-   [x] Make the algorithm independant of the data structure
-   [x] Be able to treat other events

## Usage

**Detect leaks :**

```js
const consumH = require('./hourly_consumption.json');
const Report = require('./Report');
const api = (...args) => new Report(...args);
api(consumH, (c, x) => x > 15, 3, 1, 'consommation').report();
```

1.  The first argument is the `input data`
2.  The second argument is a `function` representing the `pattern` we are looking for.
3.  The third argument is the `treshold` which represent the `number of days` necessary for an event to be reported.
4.  The fourth argument is the `cycle` which represent the `frequency` of checking (Every how many hours we should check)

**These are the mandatory arguments**

5.  The fifth argument is an optional argument representing the `key` to look for in `data`

The function accepts data in the following form:

```js
const data = {
    data: Object, // Or an Array of the relevant data or a comma sepearted string of the values
    dataKeyToTest: String,
    pattern: Function,
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

## Extas

```js
data, pattern, treshold, cycle, (dataKeyToTest = null), (refiner = null), (subset = null);
```

This is the full list of arguments you can pass to the class:

The `refiner` is an `object` used to refine the data in order to pick only a portion we want. It is contructed as such: `{key: value}`
The `key` can either be `per` which is a special value allowing us to repack the data by `value` (thus the key must exist on the data object ) or `The refiner must be an Object with properties mirroring the ones to refine on the data` meaning that the `key` must also exist on the data object but this time, `value` is an `Array` with `[SubstetStart, SubsetEnd]`

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
