const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');

// @route   GET api/reports/monthly
// @desc    Get monthly report
// @access  Private
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required (YYYY-MM)' });
    }
    
    // Parse month
    const [year, monthNum] = month.split('-').map(Number);
    
    // Create date range for the month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of month
    endDate.setHours(23, 59, 59, 999);
    
    // Find entries for the month
    const entries = await Entry.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort('date');
    
    // Calculate total hours
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    
    // Calculate average hours per entry
    const avgHours = entries.length > 0 ? totalHours / entries.length : 0;
    
    // Group by organization
    const orgBreakdown = entries.reduce((acc, entry) => {
      const org = entry.organization;
      if (!acc[org]) {
        acc[org] = 0;
      }
      acc[org] += entry.hours;
      return acc;
    }, {});
    
    // Group by day for chart data
    const dailyHours = entries.reduce((acc, entry) => {
      const day = entry.date.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += entry.hours;
      return acc;
    }, {});
    
    // Convert to array for chart
    const chartData = Object.keys(dailyHours).map(day => ({
      date: day,
      hours: dailyHours[day]
    }));
    
    res.json({
      totalHours,
      avgHours,
      entryCount: entries.length,
      organizationBreakdown: orgBreakdown,
      chartData,
      entries
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;