import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import StatCard from "@/components/stat-card";
import AppointmentCard from "@/components/appointment-card";
import { Calendar, Pill, FlaskConical, Heart, Bell, CalendarPlus, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function PatientDashboard() {
  const [, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: healthMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/health-metrics"],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    return `${greeting}, ${user.firstName} ${user.lastName}`;
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const nextAppointment = upcomingAppointments[0];
  const recentAppointments = appointments
    .filter(apt => new Date(apt.appointmentDate) < new Date())
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    .slice(0, 5);

  const currentMetrics = healthMetrics[0] || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600 mt-2">{getGreeting()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
                onClick={() => setLocation("/appointments")}
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Next Appointment"
            value={nextAppointment ? new Date(nextAppointment.appointmentDate).toLocaleDateString() : "None"}
            icon={Calendar}
            color="blue"
          />
          
          <StatCard
            title="Prescriptions"
            value="3 Active"
            icon={Pill}
            color="green"
          />
          
          <StatCard
            title="Lab Results"
            value="2 New"
            icon={FlaskConical}
            color="orange"
          />
          
          <StatCard
            title="Health Score"
            value="85/100"
            icon={Heart}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Appointments
                </CardTitle>
                <CardDescription>
                  Your appointment history and upcoming visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                    ))}
                  </div>
                ) : recentAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent appointments</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setLocation("/appointments")}
                    >
                      Book Your First Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Health Metrics & Quick Actions */}
          <div className="space-y-6">
            {/* Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-6 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Blood Pressure</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.bloodPressure || "120/80"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Heart Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.heartRate || "72"} bpm
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Weight</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.weight || "150"} lbs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Temperature</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.temperature || "98.6"}°F
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100"
                    onClick={() => setLocation("/appointments")}
                  >
                    <CalendarPlus className="h-4 w-4 mr-3" />
                    Book New Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => setLocation("/medical-records")}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    View Medical Records
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100"
                  >
                    <Pill className="h-4 w-4 mr-3" />
                    Manage Prescriptions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
