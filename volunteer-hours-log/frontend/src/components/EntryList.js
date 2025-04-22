import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const EntryList = () => {
  const { api } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('-date');

  useEffect(() => {
    fetchEntries();
  }, [currentPage, sortBy]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/entries', {
        params: {
          page: currentPage,
          limit: 10,
          sort: sortBy,
          search: searchTerm
        }
      });
      
      setEntries(res.data.entries);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEntries();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/entries/${id}`);
        setEntries(entries.filter(entry => entry._id !== id));
      } catch (err) {
        setError('Failed to delete entry');
        console.error(err);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && entries.length === 0) {
    return <div className="container text-center py-1">Loading...</div>;
  }

  return (
    <div className="entry-list">
      <div className="card">
        <div className="mb-1">
          <form onSubmit={handleSearch} className="form-group">
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search by organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
        </div>

        <div className="mb-1">
          <label className="form-label">Sort by: </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="-date">Date (Newest First)</option>
            <option value="date">Date (Oldest First)</option>
            <option value="-hours">Hours (Highest First)</option>
            <option value="hours">Hours (Lowest First)</option>
          </select>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {entries.length === 0 ? (
          <p className="text-center">No entries found.</p>
        ) : (
          <>
            {entries.map(entry => (
              <div key={entry._id} className="entry-item">
                <div className="entry-info">
                  <h3>{entry.organization}</h3>
                  <p>{formatDate(entry.date)} - {entry.hours} hours</p>
                  {entry.notes && <p><small>{entry.notes}</small></p>}
                </div>
                <div className="entry-actions">
                  <Link to={`/entries/edit/${entry._id}`} className="btn btn-secondary">Edit</Link>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span style={{ padding: '10px' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EntryList;