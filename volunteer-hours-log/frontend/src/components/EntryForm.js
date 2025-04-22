import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const EntryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    organization: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditing) {
      const fetchEntry = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/entries/${id}`);
          const { organization, date, hours, notes } = res.data;
          
          setFormData({
            organization,
            date: new Date(date).toISOString().split('T')[0],
            hours,
            notes: notes || ''
          });
        } catch (err) {
          setError('Failed to load entry');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchEntry();
    }
  }, [id, isEditing, api]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        hours: parseFloat(formData.hours)
      };
      
      if (isEditing) {
        await api.put(`/entries/${id}`, payload);
      } else {
        await api.post('/entries', payload);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditing) {
    return <div className="container text-center py-1">Loading...</div>;
  }
  
  return (
    <div className="container">
      <div className="card">
        <h2 className="text-center">
          {isEditing ? 'Edit Volunteer Entry' : 'Log Volunteer Hours'}
        </h2>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="organization" className="form-label">Organization</label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hours" className="form-label">Hours</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={onChange}
              step="0.1"
              min="0.1"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              className="form-input"
              rows="3"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;