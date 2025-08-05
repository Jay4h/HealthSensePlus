import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import StatCard from "@/components/stat-card";
import { Users, Activity, Pill, ClipboardCheck, Calendar, UserPlus, FileText, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function NurseDashboard() {
  const [, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users", { role: "patient" }],
  });

  const getGreeting = () => {
    return `Welcome back, ${user.firstName} ${user.lastName}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointmentDate === today);
  const assignedPatients = users.slice(0, 8); // Mock assigned patients

  const vitalsToRecord = assignedPatients.filter((_, index) => index % 3 === 0); // Mock patients needing vitals

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
              <p className="text-gray-600 mt-2">{getGreeting()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 flex items-center"
                onClick={() => setLocation("/medical-records")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
            </div>
          </div>
        </div>

        {/* Nurse Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Assigned Patients"
            value={assignedPatients.length.toString()}
            icon={Users}
            color="blue"
          />
          
          <StatCard
            title="Vitals to Record"
            value={vitalsToRecord.length.toString()}
            icon={Activity}
            color="green"
          />
          
          <StatCard
            title="Medications Due"
            value="12"
            icon={Pill}
            color="orange"
          />
          
          <StatCard
            title="Tasks Completed"
            value="8/10"
            icon={ClipboardCheck}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Care Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Today's Care Tasks
                </CardTitle>
                <CardDescription>
                  Patient care activities scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitalsToRecord.map((patient, index) => (
                    <div key={patient.id} className="appointment-card rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {index === 0 ? "Vital signs check" : index === 1 ? "Medication administration" : "Post-op monitoring"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {index === 0 ? "09:00 AM" : index === 1 ? "10:30 AM" : "02:00 PM"}
                          </p>
                          <p className="text-sm text-gray-600">Room {100 + index}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          index === 0 ? "bg-red-100 text-red-800" : index === 1 ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {index === 0 ? "Urgent" : index === 1 ? "Due Soon" : "Scheduled"}
                        </span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-xs"
                          >
                            Complete Task
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
                  
                  {vitalsToRecord.length === 0 && (
                    <div className="text-center py-8">
                      <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">All tasks completed for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Patients & Quick Actions */}
          <div className="space-y-6">
            {/* Assigned Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Assigned Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedPatients.slice(0, 4).map((patient, index) => (
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
                            Room {100 + index} • {index % 2 === 0 ? "Stable" : "Monitoring"}
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
                  >
                    <Activity className="h-4 w-4 mr-3" />
                    Record Vital Signs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    <Pill className="h-4 w-4 mr-3" />
                    Medication Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100"
                    onClick={() => setLocation("/medical-records")}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Update Patient Records
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Code Blue</span>
                    <span className="text-sm font-medium text-red-600">5555</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Security</span>
                    <span className="text-sm font-medium text-gray-900">5911</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pharmacy</span>
                    <span className="text-sm font-medium text-gray-900">5123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lab</span>
                    <span className="text-sm font-medium text-gray-900">5456</span>
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
