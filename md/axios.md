Great question! Let me explain this file - it's your frontend's connection to the backend!

  ---
  What is this file?

  This file sets up axios (a library for making HTTP requests) to talk to your backend API.

  ---
  Line-by-line explanation:

  Lines 1-3: Import and Setup

  import axios from 'axios';
  const API_BASE_URL = 'http://localhost:5000/api';
  - Import axios library
  - Set the base URL (your backend server address)

  Lines 5-10: Create Axios Instance

  const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
          'Content-Type': 'application/json'
      }
  });
  - Creates a reusable axios instance
  - All requests will automatically use http://localhost:5000/api as the base
  - Sets headers to tell backend we're sending JSON

  Lines 12-19: Interceptor (Auto-add Token)

  api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  });
  What's an interceptor?
  - Runs BEFORE every request is sent
  - Gets the JWT token from browser storage
  - Automatically adds it to the Authorization header
  - This means you don't have to manually add the token to every API call!

  Why is this useful?
  - Remember your protected routes need Authorization: Bearer <token>?
  - This does it automatically for every request!

  Lines 21-24: Auth API

  export const authAPI = {
      register: (userData) => api.post('/auth/register', userData),
      login: (credentials) => api.post('/auth/login', credentials)
  };
  What this does:
  - authAPI.register({ email, password, name }) → sends POST to /api/auth/register
  - authAPI.login({ email, password }) → sends POST to /api/auth/login

  Example usage in React:
  const response = await authAPI.login({
      email: "user@example.com",
      password: "password123"
  });

  Lines 26-31: Project API

  export const projectAPI = {
      getAll: () => api.get('/projects'),
      create: (projectData) => api.post('/projects', projectData),
      update: (id, projectData) => api.put(`/projects/${id}`, projectData),
      delete: (id) => api.delete(`/projects/${id}`)
  };
  Maps to your backend endpoints:
  - projectAPI.getAll() → GET /api/projects
  - projectAPI.create({ name, description }) → POST /api/projects
  - projectAPI.update(1, { name: "New Name" }) → PUT /api/projects/1
  - projectAPI.delete(1) → DELETE /api/projects/1

  Lines 33-69: Similar for Tasks, Expenses, Income

  Same pattern for all your other resources!

  Lines 71-73: Analytics API

  export const analyticsAPI = {
      getFinancials: (projectId) => api.get(`/analytics/${projectId}/financials`)
  };
  - analyticsAPI.getFinancials(2) → GET /api/analytics/2/financials

  ---
  Key Concepts:

  1. Centralized API Calls

  Instead of writing axios calls everywhere:
  // ❌ Bad - repeating code
  axios.post('http://localhost:5000/api/auth/login', data)
  axios.post('http://localhost:5000/api/auth/login', data)
  axios.post('http://localhost:5000/api/auth/login', data)

  // ✅ Good - use api.js
  authAPI.login(data)

  2. Automatic Token Management

  The interceptor automatically adds your JWT token to every request, so protected routes work without extra code!

  3. Easy to Update

  If your backend URL changes, you only update API_BASE_URL in one place!

  ---
  How you'll use this in React components:

  import { authAPI, projectAPI } from './services/api';

  // Login example
  const handleLogin = async () => {
      try {
          const response = await authAPI.login({ email, password });
          console.log(response.data); // { token, user }
      } catch (error) {
          console.error('Login failed:', error);
      }
  };

  // Get projects example
  const fetchProjects = async () => {
      try {
          const response = await projectAPI.getAll();
          console.log(response.data); // { projects: [...] }
      } catch (error) {
          console.error('Failed to fetch projects:', error);
      }
  };

  ---
  Does this make sense? Any questions before we continue?