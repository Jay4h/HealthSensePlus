
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Heart, User, Mail, Lock, Phone, MapPin, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  role: z.enum(["patient", "doctor", "nurse", "admin"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const { confirmPassword, ...signupData } = data;
      const response = await apiRequest("POST", "/api/auth/register", signupData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created Successfully",
        description: "Your account has been created. Please login to continue.",
      });
      setLocation("/login");
    },
    onError: (error) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">HealthSensePlus</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            Join HealthSensePlus to access comprehensive healthcare management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    className="pl-10"
                    {...form.register("firstName")}
                  />
                </div>
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    className="pl-10"
                    {...form.register("lastName")}
                  />
                </div>
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    {...form.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Role and Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => form.setValue("role", value)} defaultValue="patient">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-sm text-red-600">{form.formState.errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="pl-10"
                    {...form.register("dateOfBirth")}
                  />
                </div>
                {form.formState.errors.dateOfBirth && (
                  <p className="text-sm text-red-600">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="pl-10"
                  {...form.register("phoneNumber")}
                />
              </div>
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your full address"
                  className="pl-10"
                  {...form.register("address")}
                />
              </div>
              {form.formState.errors.address && (
                <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
