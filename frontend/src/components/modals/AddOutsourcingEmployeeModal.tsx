'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { outsourcingEmployeeApi } from '@/api/outsourcing';
import type { OutsourcingEmployee, OutsourcingCompany, CreateOutsourcingEmployeeDto } from '@/types/outsourcing';

interface AddOutsourcingEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: OutsourcingEmployee | null;
  companies: OutsourcingCompany[];
}

export const AddOutsourcingEmployeeModal: React.FC<AddOutsourcingEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  employee,
  companies,
}) => {
  const [formData, setFormData] = useState<CreateOutsourcingEmployeeDto>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyId: 0,
    startDate: '',
    endDate: '',
    status: 'active',
    dailyRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        companyId: employee.companyId,
        startDate: employee.startDate.split('T')[0],
        endDate: employee.endDate ? employee.endDate.split('T')[0] : '',
        status: employee.status,
        dailyRate: employee.dailyRate,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        companyId: companies[0]?.id || 0,
        startDate: '',
        endDate: '',
        status: 'active',
        dailyRate: 0,
      });
    }
    setError(null);
  }, [employee, isOpen, companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        endDate: formData.endDate || undefined,
      };

      if (employee) {
        await outsourcingEmployeeApi.update(employee.id, submitData);
      } else {
        await outsourcingEmployeeApi.create(submitData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'companyId' || name === 'dailyRate' ? Number(value) : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={employee ? 'Edit Outsourcing Employee' : 'Add Outsourcing Employee'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Position *
          </label>
          <Input
            id="position"
            name="position"
            type="text"
            required
            value={formData.position}
            onChange={handleChange}
            placeholder="Software Developer"
          />
        </div>

        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
            Outsourcing Company *
          </label>
          <select
            id="companyId"
            name="companyId"
            required
            value={formData.companyId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Rate ($) *
          </label>
          <Input
            id="dailyRate"
            name="dailyRate"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.dailyRate}
            onChange={handleChange}
            placeholder="500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : employee ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};