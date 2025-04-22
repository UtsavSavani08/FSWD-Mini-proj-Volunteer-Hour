import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportView = () => {
  const { api } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reports/monthly?month=${selectedMonth}`);
      setReportData(res.data);
    } catch (err) {
      setError('Failed to load report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCsv = () => {
    if (!reportData) return;

    // Create CSV content
    const headers = ['Date', 'Organization', 'Hours', 'Notes'];
    const rows = reportData.entries.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      entry.organization,
      entry.hours,
      entry.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `volunteer-report-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Generate options for the last 12 months
    for (let i = 0; i < 12; i++) {
      let year = currentYear;
      let month = currentMonth - i;
      
      if (month <= 0) {
        month += 12;
        year -= 1;
      }
      
      const value = `${year}-${String(month).padStart(2, '0')}`;
      const label = new Date(year, month - 1, 1).toLocaleDateString('default', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      options.push({ value, label });
    }
    
    return options;
  };

  if (loading && !reportData) {
    return <div className="container text-center py-1">Loading...</div>;
  }

  return (
    <div className="report-container">
      <div className="card">
        <div className="report-header">
          <h2>Monthly Volunteer Report</h2>
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-input"
              style={{ width: 'auto', marginRight: '10px' }}
            >
              {getMonthOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button 
              onClick={exportToCsv} 
              className="btn btn-primary"
              disabled={!reportData || reportData.entries.length === 0}
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {reportData && (
          <>
            <div className="report-stats">
              <div className="stat-card">
                <h3>Total Hours</h3>
                <div className="value">{reportData.totalHours.toFixed(1)}</div>
              </div>
              <div className="stat-card">
                <h3>Average Per Entry</h3>
                <div className="value">{reportData.avgHours.toFixed(1)}</div>
              </div>
              <div className="stat-card">
                <h3>Total Entries</h3>
                <div className="value">{reportData.entryCount}</div>
              </div>
            </div>

            <h3 className="my-1">Hours by Organization</h3>
            <div className="card">
              {Object.entries(reportData.organizationBreakdown).map(([org, hours]) => (
                <div key={org} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span>{org}</span>
                  <span><strong>{hours.toFixed(1)} hours</strong></span>
                </div>
              ))}
            </div>

            <h3 className="my-1">Daily Hours</h3>
            <div style={{ height: '300px', marginBottom: '20px' }}>
              {reportData.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('default', { day: '2-digit', month: 'short' })}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} hours`, 'Hours']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Bar dataKey="hours" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center">No data available for this period.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportView;