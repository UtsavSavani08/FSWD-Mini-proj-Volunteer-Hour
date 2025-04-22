import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <div className="container">
      <AuthForm isLogin={false} />
    </div>
  );
};

export default RegisterPage;