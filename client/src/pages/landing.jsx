import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import AnimatedButton from "@/components/animated-button";
import RoleCard from "@/components/role-card";
import { Heart, Check, Users, UserCheck, Settings, Stethoscope, Star, Award, Clock } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/login");
  };

  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    setLocation("/login");
  };

  const topDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      experience: "15 years",
      rating: 4.9,
      patients: "2,847",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurology", 
      experience: "12 years",
      rating: 4.8,
      patients: "1,923",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      experience: "18 years", 
      rating: 5.0,
      patients: "3,456",
      avatar: "ER"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedics",
      experience: "20 years",
      rating: 4.7,
      patients: "2,134",
      avatar: "JW"
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialty: "Dermatology",
      experience: "14 years",
      rating: 4.9,
      patients: "1,876",
      avatar: "LT"
    },
    {
      id: 6,
      name: "Dr. David Park",
      specialty: "Internal Medicine",
      experience: "16 years",
      rating: 4.8,
      patients: "2,567",
      avatar: "DP"
    },
    {
      id: 7,
      name: "Dr. Maria Gonzalez",
      specialty: "Psychiatry",
      experience: "13 years",
      rating: 4.9,
      patients: "1,654",
      avatar: "MG"
    },
    {
      id: 8,
      name: "Dr. Robert Kim",
      specialty: "Surgery",
      experience: "22 years",
      rating: 5.0,
      patients: "987",
      avatar: "RK"
    }
  ];

  const roles = [
    {
      title: "Patient",
      icon: Users,
      color: "medical-blue",
      description: "Manage your health records, book appointments, and communicate with healthcare providers",
      features: [
        "View medical history",
        "Book appointments", 
        "Access lab results",
        "Manage prescriptions"
      ],
      onClick: () => handleRoleSelect("patient")
    },
    {
      title: "Doctor", 
      icon: UserCheck,
      color: "healing-green",
      description: "Manage patient records, appointments, and provide comprehensive healthcare services",
      features: [
        "Patient management",
        "Schedule management",
        "Write prescriptions", 
        "Medical records"
      ],
      onClick: () => handleRoleSelect("doctor")
    },
    {
      title: "Admin",
      icon: Settings, 
      color: "healthcare-orange",
      description: "Oversee system operations, manage users, and maintain healthcare facility operations",
      features: [
        "User management",
        "System analytics",
        "Financial reports",
        "Audit logs"
      ],
      onClick: () => handleRoleSelect("admin")
    },
    {
      title: "Nurse",
      icon: Stethoscope,
      color: "purple", 
      description: "Assist with patient care, manage vitals, and coordinate with medical staff",
      features: [
        "Patient vitals",
        "Medication tracking",
        "Care coordination",
        "Patient communication"
      ],
      onClick: () => handleRoleSelect("nurse")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Complete Healthcare
                <span className="text-blue-600"> Management System</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline patient care, manage appointments, and access medical records with our comprehensive healthcare platform designed for modern medical practices.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Real-time Updates</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Multi-role Access</span>
                </div>
              </div>
              
              <AnimatedButton onClick={handleGetStarted} />
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-t-lg mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">Dr. Sarah Wilson</p>
                        <p className="text-sm text-gray-500">Cardiologist</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">Available</p>
                      <p className="text-xs text-gray-500">Next: 2:30 PM</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Today's Schedule</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Appointments</span>
                        <span className="font-medium">12/15</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Top Doctors</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet our exceptional healthcare professionals with outstanding experience and patient satisfaction
            </p>
          </div>
          
          <div className="scroll-container max-h-96 overflow-y-auto p-2 bg-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {topDoctors.map((doctor) => (
                <div key={doctor.id} className="item p-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {doctor.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white text-lg">{doctor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                      <p className="text-blue-400 font-medium">{doctor.specialty}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{doctor.experience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{doctor.patients} patients</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 text-sm font-medium">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access your personalized dashboard based on your role in the healthcare system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => (
              <RoleCard key={index} {...role} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">HealthSensePlus</span>
              </div>
              <p className="text-gray-300 mb-6">
                Comprehensive healthcare management system designed to streamline patient care and improve medical outcomes.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Patient Management</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Appointment Booking</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Medical Records</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Health Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">&copy; 2024 HealthSensePlus. All rights reserved.</p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">HIPAA Compliance</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
