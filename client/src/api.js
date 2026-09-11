import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotes = (config = {}) => api.get('/notes', config);
export const createNote = (noteData) => api.post('/notes', noteData);
export const updateNote = (id, noteData) => api.put(`/notes/${id}`, noteData);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

export default api;