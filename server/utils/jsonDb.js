const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_STORE = {
  users: [],
  scholarships: [],
  applications: [],
  notifications: [],
  workStudyPrograms: [],
  workStudyApplications: [],
  paymentPlans: []
};

const ensureStore = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE, null, 2));
  }
};

const readStore = () => {
  ensureStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw) || JSON.parse(JSON.stringify(DEFAULT_STORE));
  } catch (error) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE, null, 2));
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }
};

const writeStore = (data) => {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

const toObject = (item) => JSON.parse(JSON.stringify(item));

module.exports = { readStore, writeStore, uid, toObject };
