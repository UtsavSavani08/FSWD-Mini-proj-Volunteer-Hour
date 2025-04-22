import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <div className="container">
      <AuthForm isLogin={true} />
    </div>
  );
};

export default LoginPage;