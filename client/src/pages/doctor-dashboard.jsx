import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import StatCard from "@/components/stat-card";
import AppointmentCard from "@/components/appointment-card";
import { Users, Calendar, ClipboardCheck, Star, Clock, UserPlus, FileText, PlusCircle, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function DoctorDashboard() {
  const [, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users", { role: "patient" }],
  });

  const getGreeting = () => {
    return `Welcome back, Dr. ${user.lastName}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointmentDate === today);
  const upcomingAppointments = todayAppointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const recentPatients = users
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const remainingAppointments = upcomingAppointments.length;
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600 mt-2">{getGreeting()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 flex items-center"
                onClick={() => setLocation("/medical-records")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient Record
              </Button>
            </div>
          </div>
        </div>

        {/* Doctor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Patients"
            value={todayAppointments.length.toString()}
            icon={Users}
            color="blue"
          />
          
          <StatCard
            title="Appointments"
            value={`${remainingAppointments} Remaining`}
            icon={Calendar}
            color="green"
          />
          
          <StatCard
            title="Completed Today"
            value={completedToday.toString()}
            icon={ClipboardCheck}
            color="orange"
          />
          
          <StatCard
            title="Patient Satisfaction"
            value="4.8/5.0"
            icon={Star}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>
                      Your appointments for today, {new Date().toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                  >
                    View Full Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="appointment-card rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium text-gray-900">Patient #{appointment.patientId.slice(-6)}</h4>
                              <p className="text-sm text-gray-600">{appointment.reason || "Consultation"}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{appointment.timeSlot}</p>
                            <p className="text-sm text-gray-600">30 min</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Scheduled
                          </span>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              Start Visit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-blue-600 hover:text-blue-700 text-xs"
                              onClick={() => setLocation("/medical-records")}
                            >
                              View Chart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patient Management & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPatients.length > 0 ? (
                  <div className="space-y-4">
                    {recentPatients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-xs text-gray-600">
                              Registered: {new Date(patient.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700 text-xs"
                          onClick={() => setLocation("/medical-records")}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent patients</p>
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
                    onClick={() => setLocation("/medical-records")}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Create Medical Record
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    <PlusCircle className="h-4 w-4 mr-3" />
                    Write Prescription
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100"
                  >
                    <BarChart className="h-4 w-4 mr-3" />
                    View Analytics
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
