const LineSeparator = require('./src/index.js');
var inv = new LineSeparator.Inventory({
    3: Number.POSITIVE_INFINITY,
    4: Number.POSITIVE_INFINITY,
    5: Number.POSITIVE_INFINITY,
});
var line = LineSeparator.Line.calc(14.5, inv);
console.log(line, inv);