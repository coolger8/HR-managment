'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeAPI, departmentAPI, attendanceAPI, leaveAPI } from '@/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, Building2, UserCheck, Calendar } from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  todayAttendance: number;
  pendingLeaves: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    todayAttendance: 0,
    pendingLeaves: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [employees, departments, attendance, leaves] = await Promise.all([
          employeeAPI.getAll(),
          departmentAPI.getAll(),
          attendanceAPI.getAll(),
          leaveAPI.getAll('pending'),
        ]);

        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendance.data.filter(a => 
          a.date.startsWith(today)
        ).length;

        setStats({
          totalEmployees: employees.data.length,
          totalDepartments: departments.data.length,
          todayAttendance,
          pendingLeaves: leaves.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      description: 'Active employees in the system',
      color: 'text-blue-600',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      icon: Building2,
      description: 'Active departments',
      color: 'text-green-600',
    },
    {
      title: 'Today\'s Attendance',
      value: stats.todayAttendance,
      icon: UserCheck,
      description: 'Employees present today',
      color: 'text-purple-600',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      description: 'Leave requests pending approval',
      color: 'text-orange-600',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you can perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Add Employee</p>
                      <p className="text-sm text-gray-500">Register new employee</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Mark Attendance</p>
                      <p className="text-sm text-gray-500">Record attendance</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Add Department</p>
                      <p className="text-sm text-gray-500">Create new department</p>
                    </div>
                  </div>
                </button>
                <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Review Leaves</p>
                      <p className="text-sm text-gray-500">Approve/reject leaves</p>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New employee registered</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Attendance marked for today</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Leave request submitted</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}