import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

export default function Signup() {
  const [form, setForm] = useState({ userId: '', firstName: '', lastName: '', password: '' });
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await API.post('/signup', form);
      localStorage.setItem('userId', form.userId);
      nav('/restaurants');
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form onSubmit={submit} className={styles.signupForm}>
        <h2 className={styles.title}>Sign Up</h2>
        {['userId','firstName','lastName','password'].map(f => (
          <div key={f} className={styles.inputGroup}>
            <label className={styles.label}>{f === 'userId' ? 'User ID' : f === 'firstName' ? 'First Name' : f === 'lastName' ? 'Last Name' : 'Password'}:</label>
            <input
              className={styles.input}
              type={f==='password'?'password':'text'}
              value={form[f]}
              onChange={e=>setForm({...form, [f]:e.target.value})}
              required
            />
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>Sign Up</button>
      </form>
    </div>
  );
}
