function isNotIncrementingOrNaN(arr) {
  const array = [...arr];
  if (array.some(el => isNaN(el))) return false;
  const diff = Math.abs(array[1] - array[0]);
  return array.some((el, i, arr) => {
    if (i === arr.length - 1) return Math.abs(arr[i - 1] - el) !== diff;
    return Math.abs(arr[i + 1] - el) !== diff;
  });
}

function isNotIncrementingOrNaNTranslated(arr) {
  const cache = {couldMatch: [], all: {}};
  for (let i = 0; i < arr[0].length; i++) {
    let array = arr.map(el => Number(el[i]));
    if (isNotIncrementingOrNaN(arr)) cache.couldMatch.push(array);
    cache.all[i] = array;
  }
  return cache;
}

class DataExtractor {
  /* ========================================================================== */
  /*                                    QUALI                                   */
  /* ========================================================================== */

  // TODO : REFACTOR THIS MONSTER
  _getRelevantDataProp(data) {
    const temp = [];
    const tempArray = [];

    // IMPUT DATA IS OF TYPE STRING

    if (typeof data === 'string' && data.split(',').every(el => !isNaN(Number(el)))) {
      return data.split(',');
    } else if (Array.isArray(data)) {
      // IMPUT DATA IS OF TYPE ARRAY
      if (data.length === 0) return [];
      if (data.every(el => typeof el === 'number')) return data;
      if (typeof data[0] === 'string' && !data.some(el => isNaN(Number(el)))) {
        this.data = data.map(el => Number(el));
        return data;
      }
      if (!Array.isArray(data[0]) && typeof data[0] === 'object') {
        if (this.dataKeyToTest) return data.map(el => el[this.dataKeyToTest]);
        for (let key of Object.keys(data[0])) {
          if (Array.isArray(data[0][key]) && isNotIncrementingOrNaN(new Set(data[0][key]))) {
            this.data = {};
            this.data[key] = data[0][key];
            temp.push(key);
          }
          if (typeof data[0][key] === 'number') {
            let arr = data.map(el => el[key]);
            if (isNotIncrementingOrNaN(new Set(arr))) tempArray.push(arr);
          }
          if (Array.isArray(data[0]) && isNotIncrementingOrNaN(new Set(data[0]))) {
            temp.push(key);
          }
          if (
            typeof data[0][key] === 'string' &&
            data[0][key].split(',').every(el => !isNaN(Number(el)))
          ) {
            this.data = {};
            this.data[key] = data[0][key].split(',').map(el => Number(el));
            data[0][key] = data[0][key].split(',').map(el => Number(el));
            temp.push(key);
          }
        }
      }
      if (Array.isArray(data[0])) {
        if (
          data[0].every(el => typeof el === 'string') &&
          data
            .slice(1)
            .reduce((a, b) => {
              a = [...a, ...b];
              return a;
            }, [])
            .every(entry => !isNaN(Number(entry)))
        ) {
          const result = isNotIncrementingOrNaNTranslated(data.slice(1));
          this.special = data[0].reduce((a, b, i) => {
            a[b] = result.all[i];
            return a;
          }, {});
          if (this.dataKeyToTest) {
            const dataIndex = data[0].indexOf(this.dataKeyToTest);
            return data.slice(1).map(el => el[dataIndex]);
          }
          if (result.couldMatch.length === 1) {
            return result[0];
          }
        }
      }
    } else if (typeof data === 'object') {
      // IMPUT DATA IS OF TYPE OBJECT

      if (this.dataKeyToTest) return data[this.dataKeyToTest];
      for (let key of Object.keys(data)) {
        if (Array.isArray(data[key]) && isNotIncrementingOrNaN(new Set(data[key]))) {
          temp.push(key);
        }
        if (typeof data[key] === 'string' && data[key].split(',').every(el => !isNaN(Number(el)))) {
          this.data[key] = data[key].split(',');
          temp.push(key);
        }
      }
    }
    if (tempArray.length === 1) return tempArray[0];
    if (temp.length === 1) return data[temp[0]] ? [...data[temp[0]]] : [...data[0][temp[0]]];
    throw Error(
      `We couldn't find a processable data set in < ${data} >, please refine the input data`
    );
  }

  _splitData(data, key) {
    if (!data[0][key]) {
      throw Error(`The key <${key}> must exist in the Data Object`);
    }
    const cache = {};

    data.forEach(el => {
      cache[el[key]] = [...(cache[el[key]] || []), el];
    });
    const splitData = Object.values(cache);
    return splitData;
  }
}

module.exports = DataExtractor;
module.exports.default = DataExtractor;
