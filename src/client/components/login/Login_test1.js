import React, { useState } from 'react';

import PropTypes from 'prop-types';

// import './Login.css';

async function loginUser(credentials) {
  return fetch('http://localhost:3000/login', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = await loginUser({
      email,

      password,
    });

    setToken(token);
  }

  return (
    <div className="Login">
      <h1>Please LogIn</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>

        <input
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button block type="submit" disabled={!validateForm()}>
          Login
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
