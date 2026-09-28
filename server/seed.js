const { readStore, writeStore, uid } = require('./utils/jsonDb');
require('dotenv').config();

const seedData = async () => {
  const store = readStore();
  store.scholarships = [
    { _id: uid('scholarship'), name: 'Dr. Mamphela Ramphele Academic Excellence Bursary', description: 'For female undergraduate students in STEM.', amount: 45000, type: 'Merit-based', eligibilityCriteria: ['Female STEM student', 'Minimum 70% average'], requiredDocuments: ['Transcripts', 'Motivational Letter', 'ID'], deadline: new Date('2027-09-15'), sponsor: 'Ramphele Foundation', isActive: true, slotsAvailable: 12 },
    { _id: uid('scholarship'), name: 'Prof. Jennifer Thomson Engineering Grant', description: 'Supporting female Engineering students.', amount: 62500, type: 'Field-specific', eligibilityCriteria: ['Female Engineering students'], requiredDocuments: ['Transcripts', 'Reference Letters'], deadline: new Date('2027-10-30'), sponsor: 'Engineering Council SA', isActive: true, slotsAvailable: 8 }
  ];

  store.workStudyPrograms = [
    { _id: uid('workstudy'), title: 'Library Assistant', department: 'University Library', description: 'Assist librarians with shelving.', hoursPerWeek: 10, payRate: 180, slotsAvailable: 3, deadline: new Date('2027-04-01'), isActive: true },
    { _id: uid('workstudy'), title: 'IT Help Desk Support', department: 'IT Department', description: 'Provide technical support.', hoursPerWeek: 15, payRate: 250, slotsAvailable: 2, deadline: new Date('2027-04-15'), isActive: true }
  ];

  writeStore(store);
  console.log('✅ Demo data seeded');
  process.exit();
};

seedData();