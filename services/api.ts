import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


export const API_URL = 'http://172.20.10.4:3000';

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('auth_token');
};

export const setToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('auth_token', token);
};

export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('auth_token');
};

export const apiRequest = async (
  path: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = await getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return fetch(`${API_URL}${path}`, { ...options, headers });
};
