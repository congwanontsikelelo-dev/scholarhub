const mongoose = require('mongoose');
const { readStore, writeStore, uid, toObject } = require('../utils/jsonDb');

const normalizeCollectionName = (modelName) => {
  const base = modelName.replace(/Model$/, '');
  return `${base.toLowerCase()}s`;
};

const matchesQuery = (item, query = {}) => Object.entries(query).every(([key, value]) => {
  if (value && typeof value === 'object' && !Array.isArray(value) && ('$gte' in value || '$in' in value)) {
    if ('$gte' in value) return item[key] >= value.$gte;
    if ('$in' in value) return value.$in.includes(item[key]);
  }
  if (value && typeof value === 'object' && !Array.isArray(value) && '$ne' in value) {
    return item[key] !== value.$ne;
  }
  return item[key] === value;
});

const cloneWithMethods = (item) => {
  const doc = { ...item };
  doc.save = async function save() {
    const store = readStore();
    const collection = store[normalizeCollectionName(this.constructor && this.constructor.modelName ? this.constructor.modelName : 'users')] || [];
    const index = collection.findIndex((entry) => String(entry._id) === String(this._id));
    if (index >= 0) collection[index] = { ...collection[index], ...this };
    else collection.push({ ...this, _id: this._id || uid('id') });
    store[normalizeCollectionName(this.constructor && this.constructor.modelName ? this.constructor.modelName : 'users')] = collection;
    writeStore(store);
    return this;
  };
  doc.select = function select(fields) {
    if (!fields) return this;
    const next = { ...this };
    const excluded = (fields || '').replace(/\s+/g, '').replace(/^-/, '').split(',').filter(Boolean);
    if (fields.startsWith('-')) {
      excluded.forEach((field) => delete next[field]);
      return next;
    }
    return next;
  };
  return doc;
};

const wrapCollection = (items, modelName) => {
  const arr = (items || []).map((item) => cloneWithMethods({ ...item }));
  arr.populate = function populate() { return this; };
  arr.sort = function sortBy(spec) {
    const entries = Object.entries(spec || {})[0] || [];
    const [field, direction] = entries;
    const dir = direction === -1 || direction === 'desc' ? -1 : 1;
    this.sort((a, b) => {
      const left = a[field] ?? 0;
      const right = b[field] ?? 0;
      return (left > right ? 1 : -1) * dir;
    });
    return this;
  };
  arr.limit = function limitBy(count) {
    return this.slice(0, count);
  };
  arr.populate = function populate() { return this; };
  return arr;
};

const createModel = (name, schemaDef = {}) => {
  const collectionName = normalizeCollectionName(name);

  function Model(data = {}) {
    const obj = { ...data };
    obj._id = obj._id || uid('id');
    Object.assign(this, obj);
    this.constructor = Model;
    this.constructor.modelName = name;
  }

  Model.modelName = name;
  Model.collectionName = collectionName;

  Model.create = async (doc = {}) => {
    const item = new Model(doc);
    await item.save();
    return item;
  };

  Model.findOne = async (query = {}) => {
    const store = readStore();
    const items = store[collectionName] || [];
    const item = items.find((entry) => matchesQuery(entry, query));
    return item ? cloneWithMethods(item) : null;
  };

  Model.findById = async (id) => {
    const store = readStore();
    const items = store[collectionName] || [];
    const item = items.find((entry) => String(entry._id) === String(id));
    return item ? cloneWithMethods(item) : null;
  };

  Model.find = async (query = {}, options = {}) => {
    const store = readStore();
    const items = (store[collectionName] || []).filter((item) => matchesQuery(item, query));
    const result = wrapCollection(items, name);
    if (options.sort) result.sort(options.sort);
    return result;
  };

  Model.findByIdAndUpdate = async (id, update, options = {}) => {
    const store = readStore();
    const list = store[collectionName] || [];
    const index = list.findIndex((entry) => String(entry._id) === String(id));
    if (index < 0) return null;
    const updated = { ...list[index], ...update };
    list[index] = updated;
    store[collectionName] = list;
    writeStore(store);
    return cloneWithMethods(updated);
  };

  Model.deleteMany = async (query = {}) => {
    const store = readStore();
    const list = (store[collectionName] || []).filter((item) => !matchesQuery(item, query));
    store[collectionName] = list;
    writeStore(store);
    return list;
  };

  Model.insertMany = async (docs = []) => docs.map((doc) => new Model(doc));

  Model.discriminator = (childName, childSchema) => {
    const childModel = createModel(childName, childSchema);
    return childModel;
  };

  Model.prototype.save = async function save() {
    const store = readStore();
    const list = store[collectionName] || [];
    const index = list.findIndex((entry) => String(entry._id) === String(this._id));
    if (index >= 0) {
      list[index] = { ...list[index], ...this };
    } else {
      list.push({ ...this, _id: this._id || uid('id') });
    }
    store[collectionName] = list;
    writeStore(store);
    return this;
  };

  Model.prototype.populate = function populate() { return this; };

  Model.prototype.toJSON = function toJSON() {
    const data = { ...this };
    delete data.save;
    delete data.select;
    delete data.populate;
    return data;
  };

  return Model;
};

mongoose.Schema = class Schema {
  constructor(definition = {}, options = {}) {
    this.definition = definition;
    this.options = options;
  }
};
mongoose.Schema.Types = { ObjectId: String };
mongoose.model = createModel;
mongoose.connect = async () => {
  console.log('✅ Demo database connected');
  return true;
};
mongoose.disconnect = async () => true;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'demo://local');
    console.log('✅ MongoDB Connected (demo mode)');
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
  }
};

module.exports = connectDB;