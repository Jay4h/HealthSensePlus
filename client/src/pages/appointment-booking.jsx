import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, UserCheck, Star, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  appointmentDate: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  reason: z.string().min(1, "Please select a reason for visit"),
  insuranceProvider: z.string().optional(),
  notes: z.string().optional(),
});

export default function AppointmentBooking() {
  const [, setLocation] = useLocation();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: "",
      appointmentDate: "",
      timeSlot: "",
      reason: "",
      insuranceProvider: "",
      notes: "",
    },
  });

  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["/api/users", { role: "doctor" }],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users?role=doctor");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const { data: availableSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["/api/appointments/available-slots", { doctorId: selectedDoctor?.id, date: selectedDate }],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/appointments/available-slots?doctorId=${selectedDoctor?.id}&date=${selectedDate}`);
      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!(selectedDoctor && selectedDate),
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked Successfully",
        description: "Your appointment has been scheduled and you will receive a confirmation email.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setLocation("/dashboard/patient");
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    createAppointmentMutation.mutate(data);
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
    form.setValue("doctorId", doctorId);
    form.setValue("timeSlot", ""); // Reset time slot when doctor changes
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    form.setValue("appointmentDate", date);
    form.setValue("timeSlot", ""); // Reset time slot when date changes
  };

  // Generate next 30 days for date selection
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends for simplicity
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = generateDates();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
            <p className="text-xl text-gray-600">Schedule your visit with our healthcare professionals</p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Please fill in the following information to schedule your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Doctor Selection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Select a Doctor</h3>
                {doctorsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-xl"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map((doctor) => (
                      <label key={doctor.id} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="doctor"
                          value={doctor.id}
                          className="sr-only peer"
                          onChange={() => handleDoctorSelect(doctor.id)}
                        />
                        <div className="border-2 border-gray-200 rounded-xl p-4 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserCheck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-semibold text-gray-900">
                                Dr. {doctor.firstName} {doctor.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">{doctor.specialization || "General Practice"}</p>
                              <div className="flex items-center mt-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">4.9 (127 reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {form.formState.errors.doctorId && (
                  <p className="text-sm text-red-600 mt-2">{form.formState.errors.doctorId.message}</p>
                )}
              </div>

              {/* Step 2: Date and Time Selection */}
              {selectedDoctor && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Select Date & Time</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div>
                      <Label className="text-base font-medium mb-4 block">Choose Date</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {availableDates.map((date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          return (
                            <label key={dateStr} className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="appointmentDate"
                                value={dateStr}
                                className="sr-only peer"
                                onChange={() => handleDateSelect(dateStr)}
                              />
                              <div className="border border-gray-200 rounded-lg p-3 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                                <div className="text-sm font-medium text-gray-900">
                                  {date.toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {form.formState.errors.appointmentDate && (
                        <p className="text-sm text-red-600 mt-2">{form.formState.errors.appointmentDate.message}</p>
                      )}
                    </div>
                    
                    {/* Time Slots */}
                    <div>
                      <Label className="text-base font-medium mb-4 block">Available Times</Label>
                      {selectedDate ? (
                        slotsLoading ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
                            ))}
                          </div>
                        ) : availableSlots.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {availableSlots.map((slot) => (
                              <label key={slot} className="relative cursor-pointer">
                                <input
                                  type="radio"
                                  name="timeSlot"
                                  value={slot}
                                  className="sr-only peer"
                                  {...form.register("timeSlot")}
                                />
                                <div className="border border-gray-200 rounded-lg p-3 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                                  <span className="text-sm font-medium text-gray-900">{slot}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No available slots for this date</p>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Please select a date first</p>
                        </div>
                      )}
                      {form.formState.errors.timeSlot && (
                        <p className="text-sm text-red-600 mt-2">{form.formState.errors.timeSlot.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Appointment Details */}
              {selectedDate && form.watch("timeSlot") && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Select onValueChange={(value) => form.setValue("reason", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="new-patient">New Patient</SelectItem>
                          <SelectItem value="urgent-care">Urgent Care</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.reason && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.reason.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Select onValueChange={(value) => form.setValue("insuranceProvider", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue-cross">Blue Cross Blue Shield</SelectItem>
                          <SelectItem value="aetna">Aetna</SelectItem>
                          <SelectItem value="cigna">Cigna</SelectItem>
                          <SelectItem value="self-pay">Self-Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      placeholder="Any specific concerns or notes for the doctor..."
                      {...form.register("notes")}
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setLocation(-1)}
                >
                  Cancel
                </Button>
                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={!selectedDoctor}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={createAppointmentMutation.isPending}
                  >
                    {createAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
