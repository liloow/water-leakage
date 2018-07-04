const AnomalyDetector = require('./LeakDetector');
const hourlyConsumption = require('./hourly_consumption.json');
const res = new AnomalyDetector(hourlyConsumption, 'consommation', x => x > 15, 3, 1).report();
JSON.stringify(res);

