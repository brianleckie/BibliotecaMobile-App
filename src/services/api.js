import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (username, password) =>
  api.post('/api/auth/token/', { username, password });

export const getLibros = (params) =>
  api.get('/api/libros/', { params });

export const getLibro = (id) =>
  api.get(`/api/libros/${id}/`);

export const getCategorias = () =>
  api.get('/api/categorias/');

export const getMisPrestamos = () =>
  api.get('/api/mis-prestamos/');

export const getPerfil = () =>
  api.get('/api/perfil/');

export default api;
