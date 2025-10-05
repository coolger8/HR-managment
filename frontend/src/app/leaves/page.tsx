'use client';

import { useEffect, useState } from 'react';
import { leaveAPI, employeeAPI } from '@/api';
import { Leave, Employee } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<{
    employeeId: number | string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }>();

  useEffect(() => {
    fetchData();
  }, [selectedStatus]);

  const fetchData = async () => {
    try {
      const [leavesRes, employeesRes] = await Promise.all([
        selectedStatus === 'all' ? leaveAPI.getAll() : leaveAPI.getAll(selectedStatus),
        employeeAPI.getAll(),
      ]);

      setLeaves(leavesRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeById = (id: number) => {
    return employees.find(emp => emp.id === id);
  };

  const handleApprove = async (leaveId: number) => {
    try {
      await leaveAPI.approve(leaveId, 1); // Assuming current user ID is 1
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleReject = async (leaveId: number) => {
    try {
      await leaveAPI.reject(leaveId, 'Request rejected by manager');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const getLeaveStats = () => {
    const total = leaves.length;
    const pending = leaves.filter(l => l.status === 'pending').length;
    const approved = leaves.filter(l => l.status === 'approved').length;
    const rejected = leaves.filter(l => l.status === 'rejected').length;

    return { total, pending, approved, rejected };
  };

  const stats = getLeaveStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'personal':
        return 'bg-purple-100 text-purple-800';
      case 'maternity':
        return 'bg-pink-100 text-pink-800';
      case 'paternity':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <Button className="flex items-center space-x-2" onClick={() => setIsRequestOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Request Leave</span>
          </Button>
        </div>

        <Modal
          isOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
          title="Request Leave"
          size="lg"
        >
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              const start = new Date(values.startDate);
              const end = new Date(values.endDate);
              const daysRequested = Math.max(
                1,
                Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
              );
              try {
                await leaveAPI.create({
                  employeeId: Number(values.employeeId),
                  type: values.type as Leave['type'],
                  startDate: values.startDate,
                  endDate: values.endDate,
                  reason: values.reason,
                  daysRequested,
                });
                setIsRequestOpen(false);
                reset();
                fetchData();
              } catch (err) {
                console.error('Error creating leave:', err);
              }
            })}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <select
                  className="mt-1 w-full border rounded-md p-2"
                  {...register('employeeId', { required: true })}
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  className="mt-1 w-full border rounded-md p-2"
                  {...register('type', { required: true })}
                >
                  {['vacation', 'sick', 'personal', 'maternity', 'paternity'].map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Input type="date" className="mt-1" {...register('startDate', { required: true })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Input type="date" className="mt-1" {...register('endDate', { required: true })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  className="mt-1 w-full border rounded-md p-2"
                  rows={3}
                  {...register('reason', { required: true })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsRequestOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit
              </Button>
            </div>
          </form>
        </Modal>

        {/* Status Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <div className="grid grid-cols-1 gap-6">
          {leaves.map((leave) => {
            const employee = getEmployeeById(leave.employeeId);
            
            return (
              <Card key={leave.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                      </CardTitle>
                      <CardDescription>
                        {employee?.employeeId} • {employee?.department?.name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(leave.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Leave Type</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getLeaveTypeColor(leave.type)}`}>
                        {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Start Date</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(leave.startDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">End Date</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Duration</p>
                      <p className="text-sm text-gray-900">
                        {leave.daysRequested} day{leave.daysRequested !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {leave.reason}
                    </p>
                  </div>

                  {leave.rejectionReason && (
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-900 bg-red-50 p-3 rounded-md">
                        {leave.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Requested on {format(new Date(leave.createdAt), 'MMM dd, yyyy')}
                      {leave.approvedAt && (
                        <span> • Approved on {format(new Date(leave.approvedAt), 'MMM dd, yyyy')}</span>
                      )}
                    </div>

                    {leave.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(leave.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(leave.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {leaves.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leave requests found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}