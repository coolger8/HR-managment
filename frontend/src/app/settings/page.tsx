'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Settings, User, Building2, Clock, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Settings className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <Input value={user?.username || ''} disabled className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input value={user?.email || ''} disabled className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <Input value={user?.role || ''} disabled className="mt-1" />
              </div>
              <div className="pt-4">
                <Button>Update Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <CardTitle>Account</CardTitle>
              </div>
              <CardDescription>
                Account status and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">User ID</p>
                <p className="text-sm text-gray-900">{user?.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>
              Configure system-wide settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">General</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-gray-500">Receive email notifications</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto-save</p>
                      <p className="text-xs text-gray-500">Automatically save changes</p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Time & Attendance</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Work Start Time</label>
                    <Input type="time" defaultValue="09:00" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Work End Time</label>
                    <Input type="time" defaultValue="17:00" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t mt-6">
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <User className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Building2 className="h-6 w-6" />
                <span>System Backup</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Clock className="h-6 w-6" />
                <span>View Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {user?.role === 'admin' && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Reset System Data</p>
                    <p className="text-sm text-gray-500">Clear all data and reset to defaults</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Reset System
                  </Button>
                </div>
                <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Export Data</p>
                    <p className="text-sm text-gray-500">Download all system data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}