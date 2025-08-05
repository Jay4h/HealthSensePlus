import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import StatCard from "@/components/stat-card";
import { Users, UserCheck, Calendar, Server, Download, UserPlus, UsersIcon, BarChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard-stats"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const recentActivity = [
    {
      id: 1,
      description: "New user registered",
      time: "2 minutes ago",
      icon: UserPlus,
      color: "blue"
    },
    {
      id: 2,
      description: "Doctor updated patient record",
      time: "5 minutes ago",
      icon: UserCheck,
      color: "green"
    },
    {
      id: 3,
      description: "Appointment scheduled",
      time: "10 minutes ago",
      icon: Calendar,
      color: "orange"
    },
    {
      id: 4,
      description: "System backup completed",
      time: "1 hour ago",
      icon: Server,
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">System Overview and Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={statsLoading ? "..." : dashboardStats?.totalUsers?.toString() || "0"}
            icon={Users}
            color="blue"
          />
          
          <StatCard
            title="Active Doctors"
            value={statsLoading ? "..." : dashboardStats?.totalDoctors?.toString() || "0"}
            icon={UserCheck}
            color="green"
          />
          
          <StatCard
            title="Appointments Today"
            value={statsLoading ? "..." : dashboardStats?.todayAppointments?.toString() || "0"}
            icon={Calendar}
            color="orange"
          />
          
          <StatCard
            title="System Health"
            value="99.8%"
            icon={Server}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Analytics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <BarChart className="h-5 w-5 mr-2" />
                      System Analytics
                    </CardTitle>
                    <CardDescription>
                      Overview of system usage and performance
                    </CardDescription>
                  </div>
                  <Select defaultValue="7days">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">Analytics Dashboard</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Real-time system metrics and usage statistics
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-600">Active Sessions</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {dashboardStats?.activeUsers || 0}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-600">Total Appointments</p>
                        <p className="text-2xl font-bold text-green-600">
                          {dashboardStats?.totalAppointments || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Management */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`h-4 w-4 text-${activity.color}-600`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Management */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    <UsersIcon className="h-4 w-4 mr-3" />
                    User Management
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    <BarChart className="h-4 w-4 mr-3" />
                    System Reports
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Services</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      85% Used
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backups</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Up to Date
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
