const fs = require('fs');
const path = require('path');
const initialData = require('../data/initialData');

const DB_FILE_PATH = path.join(__dirname, '../data/db.json');

class DatabaseService {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.data = JSON.parse(JSON.stringify(initialData));
        this.save();
      }
    } catch (err) {
      console.warn('Database initialization warning, resetting from initial data:', err.message);
      this.data = JSON.parse(JSON.stringify(initialData));
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err.message);
    }
  }

  // Generic collection helpers
  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  findById(collectionName, id) {
    const list = this.getCollection(collectionName);
    return list.find(item => item.id === id);
  }

  findAll(collectionName, filterFn) {
    const list = this.getCollection(collectionName);
    if (!filterFn) return list;
    return list.filter(filterFn);
  }

  insert(collectionName, item) {
    const list = this.getCollection(collectionName);
    list.unshift(item);
    this.save();
    return item;
  }

  update(collectionName, id, updates) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.save();
    return list[index];
  }

  delete(collectionName, id) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    this.save();
    return true;
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.save();
    return this.data;
  }
}

const db = new DatabaseService();
module.exports = db;
