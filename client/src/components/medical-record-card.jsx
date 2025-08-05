import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Calendar, Stethoscope } from "lucide-react";

export default function MedicalRecordCard({ record }) {
  const { data: doctor } = useQuery({
    queryKey: ["/api/users", record.doctorId],
    enabled: !!record.doctorId,
  });

  const { data: patient } = useQuery({
    queryKey: ["/api/users", record.patientId], 
    enabled: !!record.patientId,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="medical-record-card rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900">{formatDate(record.visitDate)}</h4>
            <Badge variant="outline" className="ml-2">
              Completed
            </Badge>
          </div>
          
          <div className="flex items-center mb-2">
            <Stethoscope className="h-4 w-4 text-gray-500 mr-2" />
            <p className="text-sm text-gray-600">
              {doctor ? `Dr. ${doctor.lastName}` : "Loading..."} - {doctor?.specialization || "General Practice"}
            </p>
          </div>

          {patient && (
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <p className="text-sm text-gray-600">
                Patient: {patient.firstName} {patient.lastName}
              </p>
            </div>
          )}
          
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-900 mb-1">Diagnosis:</p>
            <p className="text-sm text-gray-700">{record.diagnosis}</p>
          </div>

          {record.treatment && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900 mb-1">Treatment:</p>
              <p className="text-sm text-gray-700">{record.treatment}</p>
            </div>
          )}

          {record.notes && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900 mb-1">Notes:</p>
              <p className="text-sm text-gray-700">{record.notes}</p>
            </div>
          )}

          {record.vitals && Object.keys(record.vitals).length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-900 mb-2">Vitals:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {record.vitals.bloodPressure && (
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="font-medium">BP:</span> {record.vitals.bloodPressure}
                  </div>
                )}
                {record.vitals.heartRate && (
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="font-medium">HR:</span> {record.vitals.heartRate} bpm
                  </div>
                )}
                {record.vitals.temperature && (
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="font-medium">Temp:</span> {record.vitals.temperature}°F
                  </div>
                )}
                {record.vitals.weight && (
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="font-medium">Weight:</span> {record.vitals.weight}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-4">
          <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
            <FileText className="h-4 w-4 mr-1" />
            View Full Record
          </Button>
        </div>
      </div>
    </div>
  );
}
