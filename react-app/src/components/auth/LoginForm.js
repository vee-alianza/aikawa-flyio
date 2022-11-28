import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { login } from '../../store/session';
// import ErrorMessage from "../ErrorMessage";
import './auth.css'

const errorClass = {
  emailInput: 'no-errors',
  passInput: 'no-errors',
  email: 'hide',
  password: 'hide'
};

const LoginForm = () => {
  const [errorMsg, setErrorMsg] = useState({ email: '', password: '' });
  const [dispErrClass, setDispErrClass] = useState({ ...errorClass });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data && data.some((ele) => ele.includes('email') || ele.includes('password'))) {
      const updateErrorClass = {};
      const errors = {};
      data.forEach((errMsg) => {
        if (errMsg.includes('password')) {
          updateErrorClass.password = '';
          updateErrorClass.passInput = '';
          errors.password = errMsg.split(':')[1].trim();
        }
        if (errMsg.includes('email')) {
          updateErrorClass.email = '';
          updateErrorClass.emailInput = '';
          errors.email = errMsg.split(':')[1].trim();
        }
      });
      setDispErrClass((prev) => ({ ...prev, ...updateErrorClass }));
      setErrorMsg((prev) => ({ ...prev, ...errors }));
    }
  };

  const DemoUser = () => {
    dispatch(login('demo@aa.io', 'password'));
  }

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/home' />;
  }

  return (
    <>
      <div className='login__wrapper'>
        <div className='login__logo'>
          <Link to='/'>
            <img src='https://user-images.githubusercontent.com/92604480/176834870-b03e1129-267b-45ef-b474-ac67a6dc5df5.png' alt='' />
          </Link>
        </div>
        <div className={`login__container`}>
          <h2>Login</h2>
          <form onSubmit={onLogin} className='auth__form login'>
            <div className='login__details'>
              <input
                required
                className={`email__input ${dispErrClass.emailInput}`}
                name='email'
                type='text'
                placeholder='Email'
                value={email}
                onChange={(e) => {
                  updateEmail(e);
                  if (!dispErrClass.email) {
                    setDispErrClass((prev) => ({ ...prev, email: 'hide', emailInput: 'no-errors' }));
                  }
                }}
              />
              <div className={`error__msg login ${dispErrClass.email}`}>
                {errorMsg.email}
              </div>
            </div>
            <div className='login__details'>
              <input
                required
                className={`${dispErrClass.passInput}`}
                name='password'
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  updatePassword(e);
                  if (!dispErrClass.password) {
                    setDispErrClass((prev) => ({ ...prev, password: 'hide', passInput: 'no-errors' }));
                  }
                }}
              />
              <div className={`error__msg login ${dispErrClass.password}`}>
                {errorMsg.password}
              </div>
              <div>
                <button
                  type='submit'
                  id='login__btn'
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Login
                </button>
                <button
                  type='button'
                  id='demo__btn'
                  onClick={DemoUser}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Demo User
                </button>
              </div>
            </div>
            <Link to="/sign-up" className="auth__link">
              Don't have an account? <span>Sign Up!</span>
            </Link>
          </form>
        </div >

      </div>
    </>
  );
};

export default LoginForm;
