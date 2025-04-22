import React from 'react';
import { Link } from 'react-router-dom';
import EntryList from '../components/EntryList';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="welcome-card fade-in">
        <h2>Welcome back, <span className="username">{user?.username || 'Volunteer'}</span></h2>
        <p>Track your volunteer hours and make a difference in your community. Your dedication helps create positive change.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/entries/new" className="btn btn-primary">
            Log New Hours
          </Link>
          <Link to="/reports" className="btn btn-secondary">
            View Reports
          </Link>
        </div>
      </div>
      
      <h3 className="my-1">Recent Entries</h3>
      <EntryList />
    </div>
  );
};

export default Dashboard;