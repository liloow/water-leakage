const AnomalyDetector = require('./LeakDetector');
const hourlyConsumption = require('./hourly_consumption.json');
const leaks = require('./potential_leakage.json');
const api = (data, dataKeyToTest, pattern, treshold, cycle, start, end) =>
  new AnomalyDetector(data, dataKeyToTest, pattern, treshold, cycle, start, end);

const consommation = hourlyConsumption.map(el => el.consommation);
const heure = hourlyConsumption.map(el => el.heure);
const jour = hourlyConsumption.map(el => el.jour);

describe('Input format testing', () => {
  it('should return the control output', done => {
    console.log('CASE: DATA = json PARAMS = EXPLICIT');
    const res = api(hourlyConsumption, 'consommation', x => x > 15, 3, 1).report();
    expect(res).toEqual(leaks);
    done();
  });

  it('should return the control output', done => {
    console.log('CASE: DATA = BUNDLE PARAMS = BUNDLE');
    const bundle = {
      data: hourlyConsumption,
      dataKeyToTest: 'consommation',
      pattern: x => x > 15,
      treshold: 3,
      cycle: 1,
      start: 0,
      end: hourlyConsumption.length,
    };
    const res = api(bundle).report();
    expect(res).toEqual(leaks);
    done();
  });

  it('should return the control output', done => {
    console.log('CASE: DATA = ARRAY PARAMS = EXPLICIT');
    const res = api(hourlyConsumption.map(el => el.consommation), null, x => x > 15, 3, 1).report();
    expect(res).toEqual(leaks.map(el => el.map(entry => entry.consommation)));
    done();
  });

  it('should return the control output', done => {
    console.log('CASE: DATA = OBJECT OF ARRAYS PARAMS = BUNDLE');
    const data = {
      consommation,
      heure,
      jour,
    };
    const config = {
      pattern: x => x > 15,
      treshold: 3,
      cycle: 1,
    };
    const res = api(data, config).report();
    expect(res).toEqual(leaks);
    done();
  });

  // it('should return the control output', done => {
  //   console.log('CASE: DATA = json PARAMS = EXPLICIT');
  //   const res = api(hourlyConsumption, 'consommation', x => x > 15, 3, 1).report();
  //   expect(res).toEqual(leaks);
  //   done();
  // });

  // it('should return the control output', done => {
  //   console.log('CASE: DATA = json PARAMS = EXPLICIT');
  //   const res = api(hourlyConsumption, 'consommation', x => x > 15, 3, 1).report();
  //   expect(res).toEqual(leaks);
  //   done();
  // });

  // it('should return the control output', done => {
  //   console.log('CASE: DATA = json PARAMS = EXPLICIT');
  //   const res = api(hourlyConsumption, 'consommation', x => x > 15, 3, 1).report();
  //   expect(res).toEqual(leaks);
  //   done();
  // });
});
