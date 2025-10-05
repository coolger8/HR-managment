'use client';

import { useEffect, useState } from 'react';
import { attendanceAPI, employeeAPI } from '@/api';
import { Attendance, Employee } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Clock, Calendar, UserCheck, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualData, setManualData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'present' as const,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [attendancesRes, employeesRes] = await Promise.all([
        attendanceAPI.getAll(selectedDate, selectedDate),
        employeeAPI.getAll(),
      ]);

      setAttendances(attendancesRes.data);
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

  const handleCheckIn = async (employeeId: number) => {
    try {
      const now = new Date();
      const checkInTime = format(now, 'HH:mm');
      await attendanceAPI.checkIn(employeeId, checkInTime);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async (employeeId: number) => {
    try {
      const now = new Date();
      const checkOutTime = format(now, 'HH:mm');
      await attendanceAPI.checkOut(employeeId, checkOutTime);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  const getAttendanceStats = () => {
    const total = attendances.length;
    const present = attendances.filter(a => a.status === 'present').length;
    const late = attendances.filter(a => a.status === 'late').length;
    const absent = employees.length - total;

    return { total, present, late, absent };
  };

  const stats = getAttendanceStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <Button className="flex items-center space-x-2" onClick={() => setIsManualOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Manual Entry</span>
          </Button>
        </div>

        {/* Date Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-64"
            />
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Check-in/out */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Check-in/out</CardTitle>
            <CardDescription>
              Select an employee to mark attendance for {format(new Date(selectedDate), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.slice(0, 6).map((employee) => {
                const attendance = attendances.find(a => a.employeeId === employee.id);
                const hasCheckedIn = !!attendance?.checkIn;
                const hasCheckedOut = !!attendance?.checkOut;

                return (
                  <div key={employee.id} className="border rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                      <p className="text-sm text-gray-600">{employee.employeeId}</p>
                    </div>
                    
                    {attendance && (
                      <div className="text-sm space-y-1">
                        {attendance.checkIn && (
                          <p className="text-green-600">Check-in: {attendance.checkIn}</p>
                        )}
                        {attendance.checkOut && (
                          <p className="text-blue-600">Check-out: {attendance.checkOut}</p>
                        )}
                        {attendance.hoursWorked && (
                          <p className="text-gray-600">Hours: {attendance.hoursWorked.toFixed(1)}h</p>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(employee.id)}
                        disabled={hasCheckedIn}
                        className="flex-1"
                      >
                        {hasCheckedIn ? 'Checked In' : 'Check In'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(employee.id)}
                        disabled={!hasCheckedIn || hasCheckedOut}
                        className="flex-1"
                      >
                        {hasCheckedOut ? 'Checked Out' : 'Check Out'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              Detailed attendance for {format(new Date(selectedDate), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Employee</th>
                      <th className="text-left p-3">Check In</th>
                      <th className="text-left p-3">Check Out</th>
                      <th className="text-left p-3">Hours</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((attendance) => {
                      const employee = getEmployeeById(attendance.employeeId);
                      return (
                        <tr key={attendance.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">
                                {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {employee?.employeeId}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-green-600 font-medium">
                              {attendance.checkIn || '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-blue-600 font-medium">
                              {attendance.checkOut || '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            {attendance.hoursWorked ? (
                              <span className="font-medium">
                                {attendance.hoursWorked.toFixed(1)}h
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                              attendance.status === 'late' ? 'bg-orange-100 text-orange-800' :
                              attendance.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {attendance.notes || '-'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No attendance records found for this date.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
        {/* Manual Entry Modal */}
        <Modal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} title="Manual Attendance Entry" size="lg">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                // 执行手动签到/签退
                if (manualData.employeeId && manualData.checkIn) {
                  await attendanceAPI.checkIn(parseInt(manualData.employeeId), manualData.checkIn);
                }
                if (manualData.employeeId && manualData.checkOut) {
                  await attendanceAPI.checkOut(parseInt(manualData.employeeId), manualData.checkOut);
                }
                await fetchData();
                setIsManualOpen(false);
              } catch (err) {
                console.error('Manual entry failed:', err);
                alert('Manual entry failed. Please check inputs and try again.');
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
                  value={manualData.employeeId}
                  onChange={(e) => setManualData((p) => ({ ...p, employeeId: e.target.value }))}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id.toString()}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <Input
                  type="date"
                  value={manualData.date}
                  onChange={(e) => setManualData((p) => ({ ...p, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <Input
                  type="time"
                  value={manualData.checkIn}
                  onChange={(e) => setManualData((p) => ({ ...p, checkIn: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <Input
                  type="time"
                  value={manualData.checkOut}
                  onChange={(e) => setManualData((p) => ({ ...p, checkOut: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
                  value={manualData.status}
                  onChange={(e) => setManualData((p) => ({ ...p, status: e.target.value as 'present' | 'late' | 'absent' }))}
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <Input
                  value={manualData.notes}
                  onChange={(e) => setManualData((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsManualOpen(false)}
                className="h-10 px-4 rounded-md border border-gray-300 bg-white text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-4 rounded-md bg-blue-600 text-white text-sm"
                disabled={!manualData.employeeId || (!manualData.checkIn && !manualData.checkOut)}
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
    </DashboardLayout>
  );
}