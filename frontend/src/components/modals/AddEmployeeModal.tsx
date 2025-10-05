'use client';

import { useState, useEffect } from 'react';
import { employeeAPI, departmentAPI, positionAPI } from '@/api';
import { Employee, Department, Position } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    hireDate: '',
    salary: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    departmentId: '',
    positionId: '',
    managerId: '',
    status: 'active' as const,
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      // Reset form when modal opens
      setFormData({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        hireDate: '',
        salary: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        departmentId: '',
        positionId: '',
        managerId: '',
        status: 'active',
      });
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [departmentsRes, positionsRes, employeesRes] = await Promise.all([
        departmentAPI.getAll(),
        positionAPI.getAll(),
        employeeAPI.getAll(),
      ]);

      setDepartments(departmentsRes.data);
      setPositions(positionsRes.data);
      setManagers(employeesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const employeeData = {
        ...formData,
        salary: parseFloat(formData.salary),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
        positionId: formData.positionId ? parseInt(formData.positionId) : undefined,
        managerId: formData.managerId ? parseInt(formData.managerId) : undefined,
      };

      await employeeAPI.create(employeeData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee" size="lg">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">Loading...</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID *
            </label>
            <Input
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              placeholder="e.g., EMP001"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <Input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Hire Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hire Date *
            </label>
            <Input
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary *
            </label>
            <Input
              name="salary"
              type="number"
              step="0.01"
              min="0"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="0.00"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              name="positionId"
              value={formData.positionId}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id.toString()}>
                  {position.title}
                </option>
              ))}
            </select>
          </div>

          {/* Manager */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager
            </label>
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
            >
              <option value="">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id.toString()}>
                  {manager.firstName} {manager.lastName} ({manager.employeeId})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Full address"
          />
        </div>

        {/* Emergency Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Name
            </label>
            <Input
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              placeholder="Contact person name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Phone
            </label>
            <Input
              name="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={handleInputChange}
              placeholder="Contact phone number"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}