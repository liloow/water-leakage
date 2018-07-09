const csvParse = require('csv-parse');
const fs = require('fs');
const Report = require('./class/Report');
const consumH = require('./hourly_consumption.json');
const leaks = require('./potential_leakage.json');
const api = (...args) => new Report(...args);

let csv = null;
const consommation = consumH.map(el => el.consommation);
const heure = consumH.map(el => el.heure);
const jour = consumH.map(el => el.jour);

describe('Input format testing', () => {
  it('should return the control output >>> CASE: DATA = json + explicit key PARAMS = EXPLICIT', done => {
    const res = api(consumH, (c, x) => x > 15, 3, 1, 'consommation').report();
    expect(res).toEqual(leaks);
    done();
  });

  it('should return the control output >>> CASE: DATA = json PARAMS = EXPLICIT', done => {
    const res = api(consumH, (c, x) => x > 15, 3, 1).report();
    expect(res).toEqual(leaks);
    done();
  });

  it('should return the control output >>> CASE: DATA = BUNDLED WITH PARAMS', done => {
    const bundle = {
      data: consumH,
      dataKeyToTest: 'consommation',
      pattern: (c, x) => x > 15,
      treshold: 3,
      cycle: 1,
    };
    const res = api(bundle).report();
    expect(res).toEqual(leaks);
    done();
  });

  it('should return the control output >>> CASE: DATA = ARRAY of numbers PARAMS = EXPLICIT', done => {
    const res = api(consumH.map(el => el.consommation), (c, x) => x > 15, 3, 1, null).report();
    expect(res).toEqual(leaks.map(el => el.map(entry => entry.consommation)));
    done();
  });

  it('should return the control output >>> CASE: DATA = OBJECT OF ARRAYS PARAMS = BUNDLE ', done => {
    const data = {
      consommation,
      heure,
      jour,
    };
    const config = {
      pattern: (c, x) => x > 15,
      treshold: 3,
      cycle: 1,
    };
    const res = api(data, config).report();
    expect(res).toEqual(leaks);
    done();
  });

  it('should return the control output >>> CASE: DATA = ARRAY OF OBJECT OF STRINGS PARAMS = BUNDLE ', done => {
    const data = [
      {
        consommation: consommation.join(),
      },
    ];
    const config = {
      pattern: (c, x) => x > 15,
      treshold: 3,
      cycle: 1,
    };
    const res = api(data, config).report();
    expect(res).toEqual(leaks.map(el => el.map(entry => ({consommation: entry.consommation}))));
    done();
  });

  it('should return the control output >>> CASE: DATA = OBJECT OF STRINGS PARAMS = BUNDLE ', done => {
    const data = {
      consommation: consommation.join(),
    };
    const config = {
      pattern: (c, x) => x > 15,
      treshold: 3,
      cycle: 1,
    };
    const res = api(data, config).report();
    expect(res).toEqual(leaks.map(el => el.map(entry => ({consommation: entry.consommation}))));
    done();
  });

  it('should return the control output >>> CASE: DATA = ARRAY OBJECT OF ARRAY PARAMS = BUNDLE ', done => {
    const data = [
      {
        consommation: consommation,
      },
    ];
    const config = {
      pattern: (c, x) => x > 15,
      treshold: 3,
      cycle: 1,
    };
    const res = api(data, config).report();
    expect(res).toEqual(leaks.map(el => el.map(entry => ({consommation: entry.consommation}))));
    done();
  });

  it('should return the control output >>> CASE: DATA = ARRAY OF STRINGS PARAMS = BUNDLE ', done => {
    const data = consommation.map(el => String(el));
    const config = {
      pattern: (c, x) => x > 15,
      treshold: 3,
      cycle: 1,
    };
    const res = api(data, config).report();
    expect(res).toEqual(leaks.map(el => el.map(entry => entry.consommation)));
    done();
  });

  it('should parse the csv correctly', done => {
    const parser = csvParse((error, data) => {
      csv = data;
      expect(csv.length).not.toBe(0);
      done();
    });
    fs.createReadStream('./hourly_consumption.csv').pipe(parser);
  });

  it('should return the control output >>> CASE: DATA = CSV PARAMS = EXPLICIT', done => {
    const res = api(csv, (c, x) => x > 15, 3, 1, 'consommation').report();
    expect(res).toEqual(leaks);
    done();
  });

  it('should return the control output >>> CASE: DATA = STRING PARAMS = EXPLICIT', done => {
    const string = consommation.join();
    const res = api(string, (c, x) => x > 15, 3, 1, null).report();
    expect(res).toEqual(leaks.map(el => el.map(entry => entry.consommation)));
    done();
  });

  it('should return only one occurence >>> DANGER = 25L  TRESHOLD = 2', done => {
    const res = api(consumH, (c, x) => x > 25, 2, 1, 'consommation').report();
    expect(res).toEqual([
      [{heure: 7, jour: 1, consommation: 34}, {heure: 8, jour: 1, consommation: 50}],
    ]);
    done();
  });

  it('should not return any occurence >>> DANGER = 205L  TRESHOLD = 2', done => {
    const res = api(consumH, (c, x) => x > 205, 2, 1, 'consommation').report();
    expect(res).toBe('Everything is ok');
    done();
  });

  it('should return >>> DANGER = 15L  TRESHOLD = 2 DURING THE NIGHT ONLY (22h-6h)', done => {
    const res = api(consumH, (c, x) => x > 15, 2, 1, 'consommation', {
      heure: ['22h', '6h'],
    }).report();
    expect(res).toEqual([
      [{heure: 2, jour: 1, consommation: 16}, {heure: 3, jour: 1, consommation: 19}],
      [{heure: 2, jour: 2, consommation: 16}, {heure: 3, jour: 2, consommation: 19}],
    ]);
    done();
  });

  it('should return >>> DANGER = 15L  TRESHOLD = 2 DURING THE FIRST DAY ONLY', done => {
    const res = api(consumH, (c, x) => x > 15, 2, 1, 'consommation', {
      jour: [1, 1],
    }).report();
    expect(res).toEqual([
      [{consommation: 16, heure: 2, jour: 1}, {consommation: 19, heure: 3, jour: 1}],
      [
        {consommation: 20, heure: 6, jour: 1},
        {consommation: 34, heure: 7, jour: 1},
        {consommation: 50, heure: 8, jour: 1},
      ],
      [
        {consommation: 23, heure: 10, jour: 1},
        {consommation: 42, heure: 11, jour: 1},
        {consommation: 24, heure: 12, jour: 1},
        {consommation: 26, heure: 13, jour: 1},
      ],
    ]);
    done();
  });

  it('should return the average consumption >>> CASE => FULL && CYCLE = 0', done => {
    const res = api(
      consumH,
      (c, ...x) => x.reduce((a, b) => (a += b), 0) / x.length,
      0,
      0,
      'consommation'
    ).report();
    expect(res).toEqual(10);
    done();
  });

  it('should return the average consumption per hour >>> CASE => FULL && CYCLE = 0', done => {
    const res = api(
      consumH,
      (c, ...x) => x.reduce((a, b) => (a += b)) / x.length,
      0,
      0,
      'consommation',
      {per: 'heure'}
    ).report();
    expect(res).toEqual([
      0,
      16,
      19,
      10,
      0,
      11.5,
      22,
      27.5,
      0,
      13,
      23,
      13,
      26,
      0,
      0,
      7,
      5,
      10,
      0,
      10,
      12,
      2.5,
      0,
      12.5,
    ]);
    done();
  });

  it('should throw non-generic, non-crashing errors', done => {
    const missingArgs = api(consumH).report();
    const invalidArgs = api(1, () => 2, 3, 4).report();
    const invalidPattern = api(1, () => null, 3, 4).report();
    const badRefiner = api(consumH, (c, x) => x > 15, 2, 1, 'consommation', 'boo').report();
    const badSplit = api(consumH, (c, x) => (x = 15), 2, 1, 'consommation', {per: 'boo'}).report();
    expect(missingArgs).toBeInstanceOf(Error);
    expect(invalidArgs).toBeInstanceOf(Error);
    expect(invalidPattern).toBeInstanceOf(Error);
    expect(badRefiner).toBeInstanceOf(Error);
    expect(badSplit).toBeInstanceOf(Error);
    done();
  });

  it('should return anomalies over 2 hours and 25l >>> DANGER = 25L  TRESHOLD = 2 HOURS', done => {
    const res = api(consumH, (c, x) => x > 25, 2, 1, 'consommation').report();
    expect(res).toEqual([
      [{heure: 7, jour: 1, consommation: 34}, {heure: 8, jour: 1, consommation: 50}],
    ]);
    done();
  });

  it('should return every time the consumption was null >>> DANGER === 0L  TRESHOLD = 1', done => {
    const res = api(consumH, (c, x) => x === 0, 1, 1, 'consommation').report();
    expect(res).toEqual([
      [{consommation: 0, heure: 1, jour: 1}],
      [{consommation: 0, heure: 5, jour: 1}],
      [{consommation: 0, heure: 9, jour: 1}],
      [{consommation: 0, heure: 14, jour: 1}, {consommation: 0, heure: 15, jour: 1}],
      [{consommation: 0, heure: 19, jour: 1}],
      [{consommation: 0, heure: 22, jour: 1}, {consommation: 0, heure: 23, jour: 1}],
      [{consommation: 0, heure: 1, jour: 1}],
      [{consommation: 0, heure: 5, jour: 2}],
      [{consommation: 0, heure: 9, jour: 2}],
      [{consommation: 0, heure: 14, jour: 2}, {consommation: 0, heure: 15, jour: 2}],
      [{consommation: 0, heure: 19, jour: 2}, {consommation: 0, heure: 20, jour: 2}],
      [{consommation: 0, heure: 23, jour: 2}],
    ]);
    done();
  });
});
