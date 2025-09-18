// Create a minimal axios client wrapper for backend API
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type Project = {
  id?: number;
  name: string;
  description?: string;
};

export type Timesheet = {
  id?: number;
  projectId?: number; // for create
  project?: Project;  // for list
  workDate: string;   // yyyy-MM-dd
  hours: number;
  notes?: string;
};
