/*
 * fs.watch events:
 *    change
 *    rename
*/

var data = {};
var fs = require('fs');
var JSONfile = require('jsonfile');
var O = require('observed');
var path = require('path');
var scratchFileExt = '.txt';
var stats = {};
var watcher = {
  file: require('watch'),
  obj: O(data),
}

module.exports = {
  init: function(filePath) {
    var dotPath = '';
    var contents = '';

    filePath = filePath || './db';

    stats = fs.statSync(filePath);

    watcher.file
    .watchTree(filePath, function(file, curr, prev) {
      if (typeof file == 'object' && prev === null && curr === null) {
        // finished walking the tree
        // we're getting a list of files here on startup
        for (var F in file) {
          F = path.normalize(F);
          if (path.extname(F) === scratchFileExt) {
            pushFileToData(F, data, dotPath, contents);
          }
        }
      } else if (prev === null) {
        // new file
        pushFileToData(F, data, dotPath, contents);
      } else if (curr.nlink === 0) {
        // file was removed
        pullFileFromData(F, data, dotPath, contents);
      } else {
        // file was changed
        pushFileToData(F, data, dotPath, contents);
      }
console.dir(data);
    });

/*
    watcher.obj
    .on('add', console.log)
    .on('update', console.log)
    .on('delete', console.log)
    .on('reconfigure', console.log)
    .on('change', console.log)
*/
  },
  data: data
}

function pullFileFromData(filePath, data, dotPath, contents) {
  dotPath = getDotPath(filePath);
  contents = JSONfile.readFileSync(filePath);
  hashDelete(data, dotPath);
}

function pushFileToData(filePath, data, dotPath, contents) {
  dotPath = getDotPath(filePath);
  contents = JSONfile.readFileSync(filePath);
  hashUpsert(data, dotPath, contents);
}

function getDotPath(strPath) {
  strPath = strPath.split('.');

  delete strPath[strPath.length-1];

  strPath = strPath.join(path.sep);
  strPath = strPath.split(path.sep);
  delete strPath[strPath.length-1];
  delete strPath[0];

  return strPath;
}

function hashUpsert(obj, dotPath, val) {
  var key = '';
  var O = obj;

  for (var I in dotPath) {
    key = dotPath[I];

    if (I < dotPath.length-2) {
      O[key] = O[key] || {};

      O = O[key];
    } else {
      O[key] = val;
    }
  }
}

function hashDelete(obj, dotPath) {
  var key = '';
  var O = obj;

  for (var I in dotPath) {
    key = dotPath[I];

    if (I < dotPath.length) {
      O = O[key];
    } else {
      delete O[key];
    }
  }
}
