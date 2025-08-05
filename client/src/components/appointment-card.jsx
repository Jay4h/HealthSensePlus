import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserCheck, Calendar, Clock } from "lucide-react";

export default function AppointmentCard({ appointment }) {
  const { data: doctor } = useQuery({
    queryKey: ["/api/users", appointment.doctorId],
    enabled: !!appointment.doctorId,
  });

  const getStatusColor = (status) => {
    const statusColors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      rescheduled: "bg-yellow-100 text-yellow-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return timeString || "Time not set";
  };

  return (
    <div className="appointment-card rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <h4 className="font-medium text-gray-900">
              {doctor ? `Dr. ${doctor.lastName}` : "Loading..."}
            </h4>
            <p className="text-sm text-gray-600">
              {doctor?.specialization || appointment.reason || "General Consultation"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(appointment.appointmentDate)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(appointment.timeSlot)}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
        <div className="flex space-x-2">
          {appointment.status === "scheduled" && (
            <Button size="sm" variant="outline" className="text-xs">
              Reschedule
            </Button>
          )}
          <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 text-xs">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
