const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');

// @route   GET api/entries
// @desc    Get all entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-date', search = '' } = req.query;
    
    // Build query
    const query = { userId: req.userId };
    
    // Add search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Count total documents
    const total = await Entry.countDocuments(query);
    
    // Find entries with pagination
    const entries = await Entry.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    res.json({
      entries,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/entries
// @desc    Create a new entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { organization, date, hours, notes } = req.body;
    
    // Simple validation
    if (!organization || !date || hours === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create new entry
    const newEntry = new Entry({
      userId: req.userId,
      organization,
      date,
      hours,
      notes
    });
    
    // Save entry
    const savedEntry = await newEntry.save();
    res.json(savedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/entries/:id
// @desc    Update an entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { organization, date, hours, notes } = req.body;
    
    // Find entry by id
    let entry = await Entry.findById(req.params.id);
    
    // Check if entry exists
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    // Check if user owns the entry
    if (entry.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update entry
    entry = await Entry.findByIdAndUpdate(
      req.params.id,
      { $set: { organization, date, hours, notes } },
      { new: true }
    );
    
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/entries/:id
// @desc    Delete an entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find entry by id
    const entry = await Entry.findById(req.params.id);
    
    // Check if entry exists
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    // Check if user owns the entry
    if (entry.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete entry
    await entry.remove();
    
    res.json({ message: 'Entry removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;