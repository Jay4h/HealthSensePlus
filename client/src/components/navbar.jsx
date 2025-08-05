import { useState } from "react";
import { useLocation } from "wouter";
import { Heart, Menu, X, User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    return `/dashboard/${user.role}`;
  };

  const navigationItems = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: getDashboardLink(), show: !!user },
    { name: "Appointments", href: "/appointments", show: !!user },
    { name: "Medical Records", href: "/medical-records", show: !!user },
    { name: "Contact", href: "/contact", show: true },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setLocation("/")}>
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">HealthSensePlus</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems
                .filter(item => item.show)
                .map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setLocation(item.href)}
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setLocation(getDashboardLink())}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/appointments")}>
                      Appointments
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/medical-records")}>
                      Medical Records
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => setLocation("/login")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigationItems
                .filter(item => item.show)
                .map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setLocation(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              {!user && (
                <Button 
                  onClick={() => {
                    setLocation("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
