'use client';

import { useState, useEffect } from 'react';
import { departmentAPI, employeeAPI } from '@/api';
import { Department, Employee } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  department?: Department | null; // Optional department for editing
}

export function AddDepartmentModal({ isOpen, onClose, onSuccess, department }: AddDepartmentModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    managerId: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      // Set form data based on whether we're editing or creating
      if (department) {
        setFormData({
          name: department.name,
          description: department.description || '',
          location: department.location || '',
          managerId: department.managerId ? department.managerId.toString() : '',
          isActive: department.isActive !== undefined ? department.isActive : true,
        });
      } else {
        // Reset form when creating new department
        setFormData({
          name: '',
          description: '',
          location: '',
          managerId: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, department]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const employeesRes = await employeeAPI.getAll();
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const departmentData = {
        ...formData,
        managerId: formData.managerId ? parseInt(formData.managerId) : undefined,
      };

      if (department) {
        // Update existing department
        await departmentAPI.update(department.id, departmentData);
      } else {
        // Create new department
        await departmentAPI.create(departmentData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
      alert(`Failed to ${department ? 'update' : 'create'} department. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={department ? "Edit Department" : "Add New Department"}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">Loading...</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={department ? "Edit Department" : "Add New Department"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Department Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department Name *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Human Resources"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Department description..."
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Building A, Floor 2"
          />
        </div>

        {/* Manager */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department Manager
          </label>
          <select
            name="managerId"
            value={formData.managerId}
            onChange={handleInputChange}
            className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
          >
            <option value="">Select Manager</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id.toString()}>
                {employee.firstName} {employee.lastName} ({employee.employeeId})
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Department is active
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? (department ? 'Updating...' : 'Creating...') : (department ? 'Update Department' : 'Create Department')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}