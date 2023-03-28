// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import fetch from 'node-fetch';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/context/AuthContext';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

 const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { authToken, token } = await response.json();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userToken', token);
      setIsAuthenticated(true);
      console.log('Login successful');
      router.push('/');
    } else {
      console.log('Login failed');
    }
  };

  return (
    <Layout>
      <main className="max-w-6xl mx-auto py-6">
      <h1 className="text-4xl mb-5">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-current rounded-sm"
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-current rounded-sm"
          />
        </div>
        <button type="submit" className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current hover:bg-slate-900 hover:text-white hover:border-slate-900"
       >Login</button>
      </form>
    </main>
    </Layout>
  );
}
