export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  hireDate: string;
  salary: number;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  departmentId?: number;
  positionId?: number;
  managerId?: number;
  status: 'active' | 'inactive' | 'terminated';
  department?: Department;
  position?: Position;
  manager?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  location?: string;
  managerId?: number;
  isActive: boolean;
  employees?: Employee[];
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: number;
  title: string;
  description?: string;
  minSalary?: number;
  maxSalary?: number;
  requirements?: string;
  isActive: boolean;
  employees?: Employee[];
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
  employeeId: number;
  employee?: Employee;
  createdAt: string;
}

export interface Leave {
  id: number;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: number;
  approvedAt?: string;
  rejectionReason?: string;
  daysRequested: number;
  employeeId: number;
  employee?: Employee;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}