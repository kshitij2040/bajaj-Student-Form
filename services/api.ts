import axios from 'axios';
import { FormResponse, UserData } from '../types/form';

const API_BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const createUser = async (userData: UserData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-user`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error('This roll number is already registered. Please try logging in instead.');
      }
      throw new Error(error.response?.data?.message || 'Failed to create user. Please try again.');
    }
    throw error;
  }
};

export const getForm = async (rollNumber: string) => {
  try {
    const response = await axios.get<FormResponse>(`${API_BASE_URL}/get-form`, {
      params: { rollNumber },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error('Form data already exists for this roll number');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch form data');
    }
    throw error;
  }
}; 