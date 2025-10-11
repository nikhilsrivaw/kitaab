import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }

});

// Add token to requests automatically 
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});


export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials)
};


// Project API calls
export const projectAPI = {
    getAll: () => api.get('/projects'),
    create: (projectData) => api.post('/projects', projectData),
    update: (id, projectData) => api.put(`/projects/${id}`, projectData),
    delete: (id) => api.delete(`/projects/${id}`)
};

  export const clientAPI = {
      getAll: () => api.get('/clients'),              
      create: (clientData) => api.post('/clients', clientData),  
      update: (id, clientData) => api.put(`/clients/${id}`, clientData),  
      delete: (id) => api.delete(`/clients/${id}`)    
  };

// Task API calls
export const taskAPI = {
    getAll: (projectId) => api.get(`/tasks/${projectId}`),
    create: (taskData) => api.post('/tasks', taskData),
    update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
    delete: (id) => api.delete(`/tasks/${id}`)
};

// Expense API calls
export const expenseAPI = {
    getByProject: (projectId) => api.get(`/expenses/${projectId}`),
    create: (expenseData) => api.post('/expenses', expenseData),
    update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
    delete: (id) => api.delete(`/expenses/${id}`)
};

// Income API calls
export const incomeAPI = {
    getByProject: (projectId) => api.get(`/incomes/${projectId}`),
    create: (incomeData) => api.post('/incomes', incomeData),
    update: (id, incomeData) => api.put(`/incomes/${id}`, incomeData),
    delete: (id) => api.delete(`/incomes/${id}`)
};

export const dashboardAPI = {
    getDashboardStats: () => api.get('/dashboard/stats')
}


// Analytics API calls
export const analyticsAPI = {
    getFinancials: (projectId) => api.get(`/analytics/${projectId}/financials`)
};

export default api;