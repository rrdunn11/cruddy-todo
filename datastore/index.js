const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
// var items = {};

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

const readFileAsync = Promise.promisify(fs.readFile);
const readOneAsync = (id) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf-8'}, (err, text) => {
      if (err) {
        reject(err);
      } else {
        resolve({id, text});
      }
    });
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
    var promArr = _.map(files, (file) => {
      let id = path.parse(file).name;
      return readOneAsync(id);
    });
    Promise.all(promArr).then((results) => {
      callback(null, results);
    });
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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }


  //get the text from the file with given id 
  //if err, then callback(new Error(`No item with id: ${id}`))
  //if exists:
  //write file with new text
  //run callback function with new id, text

  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf-8'}, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw error('Cannot update');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });



};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
