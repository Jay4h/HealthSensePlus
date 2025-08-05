import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import MedicalRecordCard from "@/components/medical-record-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Plus, User, Calendar, Upload, Activity, Pill, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  visitDate: z.string().min(1, "Visit date is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  prescription: z.string().optional(),
  vitals: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.string().optional(),
    temperature: z.string().optional(),
    weight: z.string().optional(),
  }).optional(),
});

export default function MedicalRecords() {
  const [, setLocation] = useLocation();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      patientId: "",
      visitDate: new Date().toISOString().split('T')[0],
      diagnosis: "",
      treatment: "",
      notes: "",
      prescription: "",
      vitals: {
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        weight: "",
      },
    },
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["/api/users", { role: "patient" }],
    enabled: user?.role !== "patient",
  });

  const { data: medicalRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["/api/medical-records", selectedPatient ? { patientId: selectedPatient.id } : null],
    enabled: !!selectedPatient || user?.role === "patient",
  });

  const { data: healthMetrics = [] } = useQuery({
    queryKey: ["/api/health-metrics", selectedPatient ? { patientId: selectedPatient.id } : null],
    enabled: !!selectedPatient || user?.role === "patient",
  });

  const createRecordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/medical-records", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Medical Record Created",
        description: "The medical record has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      setIsNewRecordOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Record",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      vitals: data.vitals,
      prescription: data.prescription ? [{ medication: data.prescription }] : null,
    };
    createRecordMutation.mutate(formattedData);
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPatient = user?.role === "patient" ? user : selectedPatient;
  const recentRecords = medicalRecords
    .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
    .slice(0, 5);

  const mockMedications = [
    { name: "Lisinopril", dosage: "10mg daily", prescribedBy: "Dr. Wilson", status: "Active" },
    { name: "Metformin", dosage: "500mg twice daily", prescribedBy: "Dr. Smith", status: "Active" },
    { name: "Atorvastatin", dosage: "20mg daily", prescribedBy: "Dr. Wilson", status: "Active" },
  ];

  const mockLabResults = [
    { test: "Cholesterol", value: "180 mg/dL", range: "< 200 mg/dL", date: "Dec 8, 2024", status: "Normal" },
    { test: "Blood Sugar", value: "95 mg/dL", range: "70-100 mg/dL", date: "Dec 8, 2024", status: "Normal" },
    { test: "Hemoglobin", value: "14.2 g/dL", range: "12-16 g/dL", date: "Dec 8, 2024", status: "Normal" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-gray-600 mt-2">Comprehensive patient health information</p>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role !== "patient" && (
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              )}
              {(user?.role === "doctor" || user?.role === "nurse") && (
                <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Medical Record</DialogTitle>
                      <DialogDescription>
                        Add a new medical record for a patient
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="patientId">Patient</Label>
                          <Select onValueChange={(value) => form.setValue("patientId", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                            <SelectContent>
                              {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  {patient.firstName} {patient.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.patientId && (
                            <p className="text-sm text-red-600 mt-1">{form.formState.errors.patientId.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="visitDate">Visit Date</Label>
                          <Input
                            id="visitDate"
                            type="date"
                            {...form.register("visitDate")}
                          />
                          {form.formState.errors.visitDate && (
                            <p className="text-sm text-red-600 mt-1">{form.formState.errors.visitDate.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Input
                          id="diagnosis"
                          placeholder="Enter diagnosis"
                          {...form.register("diagnosis")}
                        />
                        {form.formState.errors.diagnosis && (
                          <p className="text-sm text-red-600 mt-1">{form.formState.errors.diagnosis.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="treatment">Treatment</Label>
                        <Textarea
                          id="treatment"
                          placeholder="Describe treatment plan"
                          {...form.register("treatment")}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bloodPressure">Blood Pressure</Label>
                          <Input
                            id="bloodPressure"
                            placeholder="120/80"
                            {...form.register("vitals.bloodPressure")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="heartRate">Heart Rate</Label>
                          <Input
                            id="heartRate"
                            placeholder="72"
                            {...form.register("vitals.heartRate")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="temperature">Temperature</Label>
                          <Input
                            id="temperature"
                            placeholder="98.6"
                            {...form.register("vitals.temperature")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight</Label>
                          <Input
                            id="weight"
                            placeholder="150 lbs"
                            {...form.register("vitals.weight")}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="prescription">Prescription</Label>
                        <Textarea
                          id="prescription"
                          placeholder="List medications and dosages"
                          {...form.register("prescription")}
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Additional notes and observations"
                          {...form.register("notes")}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => setIsNewRecordOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createRecordMutation.isPending}>
                          {createRecordMutation.isPending ? "Creating..." : "Create Record"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Patient Selection/Info Sidebar */}
          <div className="lg:col-span-1">
            {user?.role === "patient" ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Patient ID: #{user.id.slice(-6)}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-sm text-gray-900">{user.dateOfBirth || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-sm text-gray-900">{user.gender || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{user.phone || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Patients</CardTitle>
                  <CardDescription>Select a patient to view records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedPatient?.id === patient.id
                            ? "bg-blue-100 border-blue-200 border"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-xs text-gray-600">ID: #{patient.id.slice(-6)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Medical Records Content */}
          <div className="lg:col-span-3">
            {currentPatient ? (
              <Tabs defaultValue="records" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="records" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Records
                  </TabsTrigger>
                  <TabsTrigger value="medications" className="flex items-center">
                    <Pill className="h-4 w-4 mr-2" />
                    Medications
                  </TabsTrigger>
                  <TabsTrigger value="labs" className="flex items-center">
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Lab Results
                  </TabsTrigger>
                  <TabsTrigger value="vitals" className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Vitals
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="records" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Records</CardTitle>
                      <CardDescription>Complete medical history and visit records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recordsLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
                          ))}
                        </div>
                      ) : recentRecords.length > 0 ? (
                        <div className="space-y-4">
                          {recentRecords.map((record) => (
                            <MedicalRecordCard key={record.id} record={record} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No medical records found</p>
                          {(user?.role === "doctor" || user?.role === "nurse") && (
                            <Button 
                              className="mt-4" 
                              onClick={() => setIsNewRecordOpen(true)}
                            >
                              Create First Record
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="medications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Medications</CardTitle>
                      <CardDescription>Active prescriptions and medications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockMedications.map((medication, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{medication.name}</h4>
                                <p className="text-sm text-gray-600">{medication.dosage}</p>
                                <p className="text-xs text-gray-500">Prescribed by {medication.prescribedBy}</p>
                              </div>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {medication.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="labs" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Laboratory Results</CardTitle>
                      <CardDescription>Recent lab tests and results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {mockLabResults.map((result, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {result.test}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.value}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {result.range}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {result.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {result.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vitals" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vital Signs</CardTitle>
                      <CardDescription>Recent vital sign measurements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {healthMetrics.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {healthMetrics[0].bloodPressure && (
                            <div className="bg-red-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">Blood Pressure</h4>
                              <p className="text-2xl font-bold text-red-600">{healthMetrics[0].bloodPressure}</p>
                              <p className="text-sm text-gray-500">mmHg</p>
                            </div>
                          )}
                          {healthMetrics[0].heartRate && (
                            <div className="bg-pink-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">Heart Rate</h4>
                              <p className="text-2xl font-bold text-pink-600">{healthMetrics[0].heartRate}</p>
                              <p className="text-sm text-gray-500">bpm</p>
                            </div>
                          )}
                          {healthMetrics[0].temperature && (
                            <div className="bg-orange-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">Temperature</h4>
                              <p className="text-2xl font-bold text-orange-600">{healthMetrics[0].temperature}</p>
                              <p className="text-sm text-gray-500">°F</p>
                            </div>
                          )}
                          {healthMetrics[0].weight && (
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">Weight</h4>
                              <p className="text-2xl font-bold text-blue-600">{healthMetrics[0].weight}</p>
                              <p className="text-sm text-gray-500">lbs</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No vital signs recorded</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {user?.role === "patient" 
                      ? "Loading your medical records..." 
                      : "Select a patient to view their medical records"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
