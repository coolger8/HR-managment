'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, UserCog } from 'lucide-react';
import { outsourcingEmployeeApi, outsourcingCompanyApi } from '@/api/outsourcing';
import type { OutsourcingEmployee, OutsourcingCompany } from '@/types/outsourcing';
import { AddOutsourcingEmployeeModal } from '@/components/modals/AddOutsourcingEmployeeModal';

export default function OutsourcingEmployeesPage() {
  const [employees, setEmployees] = useState<OutsourcingEmployee[]>([]);
  const [companies, setCompanies] = useState<OutsourcingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<OutsourcingEmployee | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, companiesData] = await Promise.all([
        outsourcingEmployeeApi.getAll(),
        outsourcingCompanyApi.getAll(),
      ]);
      // Ensure we're setting arrays to the state
      const employeesArray = Array.isArray(employeesData.data) ? employeesData.data : [];
      const companiesArray = Array.isArray(companiesData.data) ? companiesData.data : [];
      setEmployees(employeesArray);
      setCompanies(companiesArray);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Set empty arrays on error to prevent map function errors
      setEmployees([]);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this outsourcing employee?')) {
      try {
        await outsourcingEmployeeApi.delete(id);
        await fetchData();
      } catch (error) {
        console.error('Failed to delete employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleEdit = (employee: OutsourcingEmployee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.inactive;
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outsourcing Employees</h1>
            <p className="text-gray-600 mt-1">Manage external outsourcing employees</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <Card className="p-12 text-center">
            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first outsourcing employee</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {getCompanyName(employee.companyId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        <div>{employee.email}</div>
                        <div>{employee.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{new Date(employee.startDate).toLocaleDateString()}</div>
                      {employee.endDate && <div>- {new Date(employee.endDate).toLocaleDateString()}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      ${employee.dailyRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(employee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(employee.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddOutsourcingEmployeeModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={fetchData}
          employee={editingEmployee}
          companies={companies}
        />
      </div>
    </DashboardLayout>
  );
}