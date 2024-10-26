import React, { useContext, useEffect } from 'react';
import LoginForm from '../Components/LoginForm';
import FormLayout from '../Components/FormLayout';
import RegisterForm from '../Components/RegisterForm/RegisterForm';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { AuthContext } from '../Context/AuthContext';

const Login = () => {
  const { isAuthenticated, register, toggleRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      console.log(isAuthenticated)
    }
  }, [isAuthenticated, navigate])

  return (
    <div>
      <Header />
      <FormLayout>
        {register ? (
          <>
            <RegisterForm />
            <Link onClick={toggleRegister}>Déjà un compte ? Connectez-vous maintenant</Link>
          </>
        ) : (
          <>
            <LoginForm />
            <Link onClick={toggleRegister}>Créez un compte Afllo'Crypto</Link>
          </>
        )}
      </FormLayout>
    </div>
  );
};

export default Login;
