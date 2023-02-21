const mongoose = require('mongoose')

const AuditSchema = new mongoose.Schema({
  auditName: {
    type: String, 
    required: [true, 'Please provide audit name'],
    trim: true,
    maxlength: [200, 'Audit name cannot be more than 200 characters'],
  },
  period: {
    type: String, 
    enum: ['Q1','Q2', 'Q3','Q4'],
    default: 'Q1',
  },
  year: {
    type: String, 
    required: [true, 'Please provide audit year'],
    trim: true,
    maxlength: [4, 'audit year cannot be more than 4 characters'],
  },
  type: {
    type: String, 
    enum: ['Finance','IT and Security', 'Offshore'],
    default: 'Finance',
  },
  highRiskAeras: {
    type: Boolean, 
    default: false,
  },
  startDate: {
    type: Date, 
  },
  status: {
    type: String, 
    enum: ['Completed','In progress', 'Not started'],
    default: 'Not started',
  },
  completionDate: {
    type: Date, 
  },
  auditFindings: {
    type: Number,
    min: [1,'Completed audit must have at least one findings'],
    max: 100,
  },
  timeSpent: {
    type: Number,
    min: [120, 'Completed audit should last at least 120 hours'],
    max: 600,
  },
  createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:[true, 'Please provide user'],
  }
},{timestamps:true})

module.exports = mongoose.model('Audit', AuditSchema)