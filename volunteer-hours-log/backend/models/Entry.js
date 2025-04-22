const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
EntrySchema.index({ userId: 1, date: -1 });
EntrySchema.index({ organization: 'text' });

module.exports = mongoose.model('Entry', EntrySchema);