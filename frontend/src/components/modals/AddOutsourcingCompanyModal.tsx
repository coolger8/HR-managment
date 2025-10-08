'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { outsourcingCompanyApi } from '@/api/outsourcing';
import type { OutsourcingCompany, CreateOutsourcingCompanyDto } from '@/types/outsourcing';

interface AddOutsourcingCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company?: OutsourcingCompany | null;
}

export const AddOutsourcingCompanyModal: React.FC<AddOutsourcingCompanyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  company,
}) => {
  const [formData, setFormData] = useState<CreateOutsourcingCompanyDto>({
    name: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    contractStartDate: '',
    contractEndDate: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        contactPerson: company.contactPerson,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        address: company.address,
        contractStartDate: company.contractStartDate.split('T')[0],
        contractEndDate: company.contractEndDate.split('T')[0],
        status: company.status,
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        contractStartDate: '',
        contractEndDate: '',
        status: 'active',
      });
    }
    setError(null);
  }, [company, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (company) {
        await outsourcingCompanyApi.update(company.id, formData);
      } else {
        await outsourcingCompanyApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={company ? 'Edit Outsourcing Company' : 'Add Outsourcing Company'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person *
          </label>
          <Input
            id="contactPerson"
            name="contactPerson"
            type="text"
            required
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Enter contact person name"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email *
          </label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="contact@company.com"
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone *
          </label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            required
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter company address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="contractStartDate" className="block text-sm font-medium text-gray-700 mb-1">
              Contract Start Date *
            </label>
            <Input
              id="contractStartDate"
              name="contractStartDate"
              type="date"
              required
              value={formData.contractStartDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contractEndDate" className="block text-sm font-medium text-gray-700 mb-1">
              Contract End Date *
            </label>
            <Input
              id="contractEndDate"
              name="contractEndDate"
              type="date"
              required
              value={formData.contractEndDate}
              onChange={handleChange}
            />
          </div>
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
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : company ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};