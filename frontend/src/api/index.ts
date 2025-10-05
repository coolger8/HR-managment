import axios, { AxiosResponse } from 'axios';
import { User, Employee, Department, Position, Attendance, Leave } from '@/types';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post<{ access_token: string; user: User }>('/auth/login', credentials),

  register: (userData: { username: string; email: string; password: string; role?: string }) =>
    api.post<User>('/auth/register', userData),

  getProfile: () =>
    api.get<User>('/auth/profile'),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get<Employee[]>('/employees'),
  getById: (id: number) => api.get<Employee>(`/employees/${id}`),
  create: (employee: Partial<Employee>) => api.post<Employee>('/employees', employee),
  update: (id: number, employee: Partial<Employee>) => api.patch<Employee>(`/employees/${id}`, employee),
  delete: (id: number) => api.delete(`/employees/${id}`),
  getByDepartment: (departmentId: number) => api.get<Employee[]>(`/employees/department/${departmentId}`),
  getByManager: (managerId: number) => api.get<Employee[]>(`/employees/manager/${managerId}`),
};

// Department API
export const departmentAPI = {
  getAll: () => api.get<Department[]>('/departments'),
  getById: (id: number) => api.get<Department>(`/departments/${id}`),
  create: (department: Partial<Department>) => api.post<Department>('/departments', department),
  update: (id: number, department: Partial<Department>) => api.patch<Department>(`/departments/${id}`, department),
  delete: (id: number) => api.delete(`/departments/${id}`),
};

// Position API
export const positionAPI = {
  getAll: () => api.get<Position[]>('/positions'),
  getById: (id: number) => api.get<Position>(`/positions/${id}`),
  create: (position: Partial<Position>) => api.post<Position>('/positions', position),
  update: (id: number, position: Partial<Position>) => api.patch<Position>(`/positions/${id}`, position),
  delete: (id: number) => api.delete(`/positions/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    // 防缓存参数，确保获取最新数据
    params.append('_ts', Date.now().toString());
    return api.get<Attendance[]>(`/attendance?${params.toString()}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
  },
  getById: (id: number) => api.get<Attendance>(`/attendance/${id}`),
  create: (attendance: Partial<Attendance>) => api.post<Attendance>('/attendance', attendance),
  update: (id: number, attendance: Partial<Attendance>) => api.patch<Attendance>(`/attendance/${id}`, attendance),
  delete: (id: number) => api.delete(`/attendance/${id}`),
  getByEmployee: (employeeId: number) => api.get<Attendance[]>(`/attendance/employee/${employeeId}`),
  checkIn: (employeeId: number, checkInTime: string) =>
    api.post<Attendance>('/attendance/check-in', { employeeId, checkInTime }),
  checkOut: (employeeId: number, checkOutTime: string) =>
    api.post<Attendance>('/attendance/check-out', { employeeId, checkOutTime }),
};

// Leave API
export const leaveAPI = {
  getAll: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return api.get<Leave[]>(`/leaves${params}`);
  },
  getById: (id: number) => api.get<Leave>(`/leaves/${id}`),
  create: (leave: Partial<Leave>) => api.post<Leave>('/leaves', leave),
  update: (id: number, leave: Partial<Leave>) => api.patch<Leave>(`/leaves/${id}`, leave),
  delete: (id: number) => api.delete(`/leaves/${id}`),
  getByEmployee: (employeeId: number) => api.get<Leave[]>(`/leaves/employee/${employeeId}`),
  approve: (id: number, approvedBy: number) =>
    api.post<Leave>(`/leaves/${id}/approve`, { approvedBy }),
  reject: (id: number, rejectionReason: string) =>
    api.post<Leave>(`/leaves/${id}/reject`, { rejectionReason }),
};

export default api;