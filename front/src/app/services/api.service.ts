import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor() {}

  async get(endpoint: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error('Error en GET request:', error);
      throw error;
    }
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${this.apiUrl}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Error en POST request:', error);
      throw error;
    }
  }

  async put(endpoint: string, data: any) {
    try {
      const response = await axios.put(`${this.apiUrl}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Error en PUT request:', error);
      throw error;
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await axios.delete(`${this.apiUrl}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error('Error en DELETE request:', error);
      throw error;
    }
  }
}