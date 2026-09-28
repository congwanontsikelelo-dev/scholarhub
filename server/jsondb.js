const { readStore, writeStore, uid, toObject } = require('./utils/jsonDb');

const collections = {
  users: 'users',
  scholarships: 'scholarships',
  applications: 'applications',
  notifications: 'notifications',
  workStudyPrograms: 'workStudyPrograms',
  workStudyApplications: 'workStudyApplications',
  paymentPlans: 'paymentPlans'
};

const getCollection = (name) => {
  const store = readStore();
  return store[name] || [];
};

const saveCollection = (name, items) => {
  const store = readStore();
  store[name] = items;
  writeStore(store);
};

const findOne = async (collectionName, query = {}) => {
  const items = getCollection(collections[collectionName] || collectionName);
  for (const item of items) {
    const matches = Object.entries(query).every(([key, value]) => item[key] === value);
    if (matches) return toObject(item);
  }
  return null;
};

const findMany = async (collectionName, query = {}, options = {}) => {
  const items = getCollection(collections[collectionName] || collectionName);
  const result = items.filter((item) => Object.entries(query).every(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && value.$gte) {
      return item[key] >= value.$gte;
    }
    if (value && typeof value === 'object' && !Array.isArray(value) && value.$in) {
      return value.$in.includes(item[key]);
    }
    return item[key] === value;
  }));

  if (options.sort) {
    const [field, direction] = Object.entries(options.sort)[0];
    result.sort((a, b) => {
      const av = a[field] ?? 0;
      const bv = b[field] ?? 0;
      return direction === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
    });
  }

  return result.map(toObject);
};

const insertOne = async (collectionName, doc) => {
  const list = getCollection(collections[collectionName] || collectionName);
  const item = { ...doc, _id: doc._id || uid('id') };
  list.push(item);
  saveCollection(collections[collectionName] || collectionName, list);
  return toObject(item);
};

const updateOne = async (collectionName, query, updateData) => {
  const list = getCollection(collections[collectionName] || collectionName);
  const index = list.findIndex((item) => Object.entries(query).every(([key, value]) => item[key] === value));
  if (index === -1) return null;
  const updated = { ...list[index], ...updateData };
  list[index] = updated;
  saveCollection(collections[collectionName] || collectionName, list);
  return toObject(updated);
};

const updateMany = async (collectionName, query, updateData) => {
  const list = getCollection(collections[collectionName] || collectionName);
  const updated = list.map((item) => {
    const matches = Object.entries(query).every(([key, value]) => item[key] === value);
    return matches ? { ...item, ...updateData } : item;
  });
  saveCollection(collections[collectionName] || collectionName, updated);
  return updated.map(toObject);
};

const deleteMany = async (collectionName, query = {}) => {
  const list = getCollection(collections[collectionName] || collectionName);
  const filtered = list.filter((item) => !Object.entries(query).every(([key, value]) => item[key] === value));
  saveCollection(collections[collectionName] || collectionName, filtered);
  return filtered.map(toObject);
};

const findById = async (collectionName, id) => {
  const items = getCollection(collections[collectionName] || collectionName);
  const item = items.find((entry) => entry._id === id || entry.id === id);
  return item ? toObject(item) : null;
};

const findByIdAndUpdate = async (collectionName, id, updateData) => {
  const list = getCollection(collections[collectionName] || collectionName);
  const index = list.findIndex((item) => item._id === id || item.id === id);
  if (index === -1) return null;
  const updated = { ...list[index], ...updateData };
  list[index] = updated;
  saveCollection(collections[collectionName] || collectionName, list);
  return toObject(updated);
};

const modelProxy = (collectionName) => ({
  findOne: (query) => findOne(collectionName, query),
  find: (query = {}, options = {}) => findMany(collectionName, query, options),
  findById: (id) => findById(collectionName, id),
  findByIdAndUpdate: (id, updateData) => findByIdAndUpdate(collectionName, id, updateData),
  create: (doc) => insertOne(collectionName, doc),
  deleteMany: (query = {}) => deleteMany(collectionName, query),
  insertMany: (docs) => Promise.all(docs.map((doc) => insertOne(collectionName, doc))),
  updateOne: (query, updateData) => updateOne(collectionName, query, updateData),
  updateMany: (query, updateData) => updateMany(collectionName, query, updateData)
});

module.exports = { modelProxy, collections, getCollection, saveCollection };
