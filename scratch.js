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
          if (path.extname(F) === scratchFileExt) {
            dotPath = getDotPath(F);
            contents = JSONfile.readFileSync(F);
            hashUpsert(data, dotPath, contents);
          }
        }
      } else if (prev === null) {
        // new file
        dotPath = F.split(path.sep);
        contents = JSONfile.readFileSync(F);
        hashUpsert(data, dotPath, contents);
      } else if (curr.nlink === 0) {
        // file was removed
        dotPath = F.split(path.sep);
        contents = JSONfile.readFileSync(F);
        hashDelete(data, dotPath);
      } else {
        // file was changed
        dotPath = F.split(path.sep);
        contents = JSONfile.readFileSync(F);
        hashUpsert(data, dotPath, contents);
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

    O[key] = O[key] || {};

    O = O[key];
  }

  O = val;
console.dir(O);
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
