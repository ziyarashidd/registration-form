import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import SignUp from './Signup';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="App">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {isLogin ? (
        <Login />
      ) : (
        <SignUp />
      )}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an Account' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default App;
