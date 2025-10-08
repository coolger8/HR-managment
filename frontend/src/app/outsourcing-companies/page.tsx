'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { outsourcingCompanyApi } from '@/api/outsourcing';
import type { OutsourcingCompany } from '@/types/outsourcing';
import { AddOutsourcingCompanyModal } from '@/components/modals/AddOutsourcingCompanyModal';

export default function OutsourcingCompaniesPage() {
  const [companies, setCompanies] = useState<OutsourcingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<OutsourcingCompany | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await outsourcingCompanyApi.getAll();
      // Ensure we're setting an array to the state
      const data = Array.isArray(response.data) ? response.data : [];
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      // Set empty array on error to prevent map function errors
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this outsourcing company?')) {
      try {
        await outsourcingCompanyApi.delete(id);
        await fetchCompanies();
      } catch (error) {
        console.error('Failed to delete company:', error);
        alert('Failed to delete company');
      }
    }
  };

  const handleEdit = (company: OutsourcingCompany) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.inactive;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outsourcing Companies</h1>
            <p className="text-gray-600 mt-1">Manage external outsourcing companies</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first outsourcing company</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusBadge(company.status)}`}>
                      {company.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(company.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Contact Person:</span>
                    <p className="font-medium">{company.contactPerson}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{company.contactEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{company.contactPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium">{company.address}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Contract Period:</span>
                    <p className="font-medium">
                      {new Date(company.contractStartDate).toLocaleDateString()} - {new Date(company.contractEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <AddOutsourcingCompanyModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={fetchCompanies}
          company={editingCompany}
        />
      </div>
    </DashboardLayout>
  );
}