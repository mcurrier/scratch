//var db = require('./scratch');
var watch = require('watch');

//db.init('./db');

watch.createMonitor('./db', function(monitor) {
  monitor.on('created', function(file, stat) {
    console.dir(arguments);
  });

  monitor.on('changed', function(file, curr, prev) {
    console.dir(arguments);
  });

  monitor.on('removed', function(file, stat) {
    console.dir(arguments);
  });
});
