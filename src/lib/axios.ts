import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Interceptor for attaching token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('token');
    
    // If not in direct 'token' key, check Zustand persist storage
    if (!token) {
      const authData = localStorage.getItem('admin-auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          token = parsed.state?.token;
        } catch (e) {
          console.error('Failed to parse auth data', e);
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
