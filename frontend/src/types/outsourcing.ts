export interface OutsourcingCompany {
  id: number;
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  contractStartDate: string;
  contractEndDate: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface OutsourcingEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyId: number;
  company?: OutsourcingCompany;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'completed';
  dailyRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutsourcingCompanyDto {
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  contractStartDate: string;
  contractEndDate: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface CreateOutsourcingEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyId: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'completed';
  dailyRate: number;
}