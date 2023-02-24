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
    type: String, 
    enum: ['Yes','No'],
    default: 'No',
  },
  startDate: {
    type: Date,
    default: Date.now(), 
  },
  status: {
    type: String, 
    enum: ['Completed','In progress', 'Not started'],
    default: 'Not started',
  },
  completionDate: {
    type: Date,
    default: Date.now(),
  },
  auditFindings: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:[true, 'Please provide user'],
  }
},{timestamps:true})

// Returns a date in 'yyyy-MM-dd' format
// AuditSchema.methods.formatDate = function(datePropery) {
//   const newDate = new Date(this[dateProperty]);
//   let formattedDate = `${ newDate.getFullYear() }-`;
//       formattedDate += `${ `0${ newDate.getMonth() + 1 }`.slice(-2) }-`;  // for double digit month
//       formattedDate += `${ `0${ newDate.getDate() }`.slice(-2) }`;        // for double digit day
//   return formattedDate;
// }


module.exports = mongoose.model('Audit', AuditSchema)