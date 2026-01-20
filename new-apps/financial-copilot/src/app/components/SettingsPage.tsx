import React, { useState } from 'react';
import { User, Lock, Bell, Database, Mail, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import api from '../services/api';

const SettingsPage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    name: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetAlerts: true,
    weeklyReports: false,
    transactionNotifications: true
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await api.put('/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleNotificationToggle = async (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
    try {
      await api.put('/user/notifications', { ...notifications, [key]: value });
      toast.success('Notification preferences updated!');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get('/user/export');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This action cannot be undone and will permanently delete all your data.')) {
      return;
    }

    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    try {
      await api.delete('/user/account');
      toast.success('Account deleted. Logging out...');
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-slate-500">Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-100"
                placeholder="John Doe"
              />
            </div>
            <Button type="submit" style={{
              background: 'linear-gradient(145deg, #3b82f6, #2563eb)'
            }}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription className="text-slate-500">Change your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-slate-100"
              />
            </div>
            <Button type="submit" style={{
              background: 'linear-gradient(145deg, #3b82f6, #2563eb)'
            }}>
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-slate-500">Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 font-semibold">Email Alerts</p>
              <p className="text-sm text-slate-500">Receive important account updates</p>
            </div>
            <Switch
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) => handleNotificationToggle('emailAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 font-semibold">Budget Alerts</p>
              <p className="text-sm text-slate-500">Get notified when approaching budget limits</p>
            </div>
            <Switch
              checked={notifications.budgetAlerts}
              onCheckedChange={(checked) => handleNotificationToggle('budgetAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 font-semibold">Weekly Reports</p>
              <p className="text-sm text-slate-500">Receive weekly financial summaries</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => handleNotificationToggle('weeklyReports', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 font-semibold">Transaction Notifications</p>
              <p className="text-sm text-slate-500">Get notified of new transactions</p>
            </div>
            <Switch
              checked={notifications.transactionNotifications}
              onCheckedChange={(checked) => handleNotificationToggle('transactionNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription className="text-slate-500">Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-3">Export all your financial data in JSON format</p>
            <Button onClick={handleExportData} variant="outline" className="border-slate-700">
              Export My Data
            </Button>
          </div>
          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-sm text-slate-400 mb-3">Permanently delete your account and all associated data</p>
            <Button onClick={handleDeleteAccount} variant="destructive" className="bg-red-600 hover:bg-red-700">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
