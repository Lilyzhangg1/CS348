import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ userId: '', firstName: '', lastName: '', password: '' });
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await API.post('/signup', form);
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Sign Up</h2>
      {['userId','firstName','lastName','password'].map(f => (
        <div key={f}>
          <label>{f}: </label>
          <input
            type={f==='password'?'password':'text'}
            value={form[f]}
            onChange={e=>setForm({...form, [f]:e.target.value})}
            required
          />
        </div>
      ))}
      <button type="submit">Sign Up</button>
    </form>
  );
}
