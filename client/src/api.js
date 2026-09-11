import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Request Interceptor: подставляет токен в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: при получении 401 сбрасывает токен и перезагружает страницу
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload(); // Возвращает на экран авторизации
    }
    return Promise.reject(error);
  }
);

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (credentials) => api.post('/auth/register', credentials);

export const fetchNotes = (config = {}) => api.get('/notes', config);
export const createNote = (noteData) => api.post('/notes', noteData);
export const updateNote = (id, noteData) => api.put(`/notes/${id}`, noteData);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

export default api;