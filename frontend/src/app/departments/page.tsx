'use client';

import { useEffect, useState } from 'react';
import { departmentAPI, employeeAPI } from '@/api';
import { Department, Employee } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AddDepartmentModal } from '@/components/modals/AddDepartmentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, Users, MapPin } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [departmentsRes, employeesRes] = await Promise.all([
        departmentAPI.getAll(),
        employeeAPI.getAll(),
      ]);

      setDepartments(departmentsRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeesByDepartment = (departmentId: number) => {
    return employees.filter(emp => emp.departmentId === departmentId);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <Button className="flex items-center space-x-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Department</span>
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.filter(dept => dept.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => {
            const departmentEmployees = getEmployeesByDepartment(department.id);
            
            return (
              <Card key={department.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{department.name}</CardTitle>
                      <CardDescription>
                        {department.description || 'No description'}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location */}
                  {department.location && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{department.location}</span>
                    </div>
                  )}

                  {/* Employee Count */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{departmentEmployees.length} employees</span>
                  </div>

                  {/* Employee List */}
                  {departmentEmployees.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Team Members:</p>
                      <div className="space-y-1">
                        {departmentEmployees.slice(0, 3).map((employee) => (
                          <div key={employee.id} className="flex items-center space-x-2 text-sm">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </span>
                            </div>
                            <span className="text-gray-600 truncate">
                              {employee.firstName} {employee.lastName}
                            </span>
                          </div>
                        ))}
                        {departmentEmployees.length > 3 && (
                          <p className="text-xs text-gray-500 pl-8">
                            +{departmentEmployees.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        department.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {department.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredDepartments.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No departments found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Add Department Modal */}
        <AddDepartmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchData}
        />
      </div>
    </DashboardLayout>
  );
}