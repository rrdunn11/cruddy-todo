const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('Cannot create!');
    } else {
      // console.log(`${exports.dataDir}`, `${id}.txt`)
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw ('Cannot create, writeFile');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
// var data = _.map(items, (text, id) => {
//   return { id, text };
// });
// callback(null, data);
//get access to all files in the data folder (? fs.readdir)
  //read contents of the file (readFile)
  //can we pass in the path as 1st arg in fs.readFile? 
  //read the file name (path.basename())

  fs.readdir(exports.dataDir, (err,files) => {
    var output = [];
    _.map(files, (file) => {
      var id = file.replace('.txt', '');
      output.push({id: id, text: id});
      // fs.readFile(`${exports.dataDir}/${file}`, {encoding: 'utf-8'}, (err, fileData) => {
      //   console.log('fileData', fileData, id)
      // })
    });
    callback(null, output);
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  //get text from file with given id; use fs.readFile. Add .txt to the end of id
  //check if text exists,
  // if not, then throw error with given id
  // if so, then apply callback with id, text object
  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf-8'}, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: fileData});
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }





};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
