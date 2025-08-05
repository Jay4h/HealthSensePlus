import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export default function Contact() {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      setRating(0);
    },
    onError: (error) => {
      toast({
        title: "Failed to Submit Feedback",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    submitContactMutation.mutate(data);
  };

  const handleRating = (starRating) => {
    setRating(starRating);
    submitFeedbackMutation.mutate({
      rating: starRating,
      category: "general",
      comment: "Quick rating submission",
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Healthcare Drive\nMedical District, MD 12345",
      color: "blue",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "Emergency: (555) 911-1234\nGeneral: (555) 123-4567",
      color: "green",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "info@healthsenseplus.com\nsupport@healthsenseplus.com",
      color: "orange",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Emergency Only",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Contact & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our healthcare team or provide feedback about your experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      {...form.register("firstName")}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Your last name"
                      {...form.register("lastName")}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select onValueChange={(value) => form.setValue("subject", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="appointment">Appointment Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.subject && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.message.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={submitContactMutation.isPending}
                >
                  {submitContactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className={`w-12 h-12 bg-${info.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`h-5 w-5 text-${info.color}-600`} />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">{info.title}</h4>
                        <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback Section */}
            <Card className="bg-gradient-to-br from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  We Value Your Feedback
                </CardTitle>
                <CardDescription>
                  Help us improve our healthcare services by sharing your experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Rate your experience:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className={`text-2xl ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                          } hover:text-yellow-500 transition-colors`}
                          disabled={submitFeedbackMutation.isPending}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {rating > 0 && (
                    <div className="text-center">
                      <p className="text-green-600 font-medium">
                        Thank you for rating us {rating} star{rating !== 1 ? 's' : ''}!
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // This could open a more detailed feedback modal
                      toast({
                        title: "Detailed Feedback",
                        description: "This feature would open a detailed feedback form.",
                      });
                    }}
                  >
                    Leave Detailed Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Contact</CardTitle>
                <CardDescription className="text-red-700">
                  For medical emergencies, please call 911 immediately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Emergency Hotline</p>
                    <p className="text-red-700">(555) 911-1234</p>
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
