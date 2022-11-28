import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, Link } from 'react-router-dom';
import { signUp } from '../../store/session';
import './auth.css'

const errorClass = {
  emailInput: 'no-errors',
  userNameInput: 'no-errors',
  passInput: 'no-errors',
  email: 'hide',
  userName: 'hide',
  password: 'hide',
  confirmPass: 'hide'
};

const SignUpForm = () => {
  const [errorMsg, setErrorMsg] = useState({ email: '', userName: '', password: '', confirmPass: '' });
  const [dispErrClass, setDispErrClass] = useState({ ...errorClass });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data && data.some((ele) => ele.includes('email') || ele.includes('password') || ele.includes('username'))) {
        const updateErrorClass = {};
        const errors = {};
        data.forEach((errMsg) => {
          if (errMsg.includes('email')) {
            updateErrorClass.email = '';
            errors.email = errMsg.split(':')[1].trim();
          }
          if (errMsg.includes('username')) {
            updateErrorClass.userName = '';
            errors.userName = errMsg.split(':')[1].trim();
          }
          if (errMsg.includes('password')) {
            updateErrorClass.password = '';
            errors.password = errMsg.split(':')[1].trim();
          }
        });
        setDispErrClass((prev) => ({ ...prev, ...updateErrorClass }));
        setErrorMsg((prev) => ({ ...prev, ...errors }));
      }
    } else {
      setDispErrClass((prev) => ({ ...prev, confirmPass: '' }));
      setErrorMsg((prev) => ({ ...prev, confirmPass: 'Passwords must match.' }));
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/home' />;
  }

  return (
    <>
      <div className='sign-up__wrapper'>
        <div className='sign-up__logo'>
          <Link to='/'>
            <img src='https://user-images.githubusercontent.com/92604480/176834870-b03e1129-267b-45ef-b474-ac67a6dc5df5.png' alt='' />
          </Link>
        </div>
        <div className='sign-up__container'>
          <h2>Sign Up</h2>
          <form onSubmit={onSignUp} className='auth__form sign-up'>
            <div className='sign-up__details'>
              <input
                // required
                type='text'
                name='username'
                placeholder='Username'
                onChange={(e) => {
                  updateUsername(e);
                  if (!dispErrClass.userName) {
                    setDispErrClass((prev) => ({ ...prev, userName: 'hide' }));
                  }
                }}
                value={username}
              ></input>
              <div className={`error__msg ${dispErrClass.userName}`}>
                {errorMsg.userName}
              </div>
            </div>
            <div className='sign-up__details'>
              <input
                // required
                type='text'
                name='email'
                placeholder='Email'
                onChange={(e) => {
                  updateEmail(e);
                  if (!dispErrClass.email) {
                    setDispErrClass((prev) => ({ ...prev, email: 'hide' }));
                  }
                }}
                value={email}
              ></input>
              <div className={`error__msg ${dispErrClass.email}`}>
                {errorMsg.email}
              </div>
            </div>
            <div className='sign-up__details'>
              <input
                // required
                type='password'
                name='password'
                placeholder='Password'
                onChange={(e) => {
                  updatePassword(e);
                  if (!dispErrClass.password) {
                    setDispErrClass((prev) => ({ ...prev, password: 'hide' }));
                  }
                }}
                value={password}
              ></input>
              <div className={`error__msg ${dispErrClass.password}`}>
                {errorMsg.password}
              </div>
            </div>
            <div className='sign-up__details'>
              <input
                type='password'
                name='repeat_password'
                placeholder='Confirm Password'
                onChange={(e) => {
                  updateRepeatPassword(e);
                  if (!dispErrClass.confirmPass) {
                    setDispErrClass((prev) => ({ ...prev, confirmPass: 'hide' }));
                  }
                }}
                value={repeatPassword}
              // required
              ></input>
              <div className={`error__msg ${dispErrClass.confirmPass}`}>
                {errorMsg.confirmPass}
              </div>
              <button type='submit' id='sign-up__btn'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Sign Up
              </button>
            </div>
            <Link to="/login" className="auth__link">
              Already have an account? <span>Log In!</span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
