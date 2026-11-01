import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
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

export const fetchShares = (id) => api.get(`/notes/${id}/share`);
export const shareNote = (id, data) => api.post(`/notes/${id}/share`, data);
export const unshareNote = (id, userId) => api.delete(`/notes/${id}/share/${userId}`);
export const leaveNote = (id) => api.delete(`/notes/${id}/leave`);

export default api; 