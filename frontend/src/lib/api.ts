import { useAuthStore } from '../store/auth';

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    useAuthStore.getState().logout();
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'An error occurred');
  }

  return response.json();
} 