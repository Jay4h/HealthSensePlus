import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - isLoading:', isLoading, 'user:', user);
    if (!isLoading && !user) {
      console.log('Redirecting to login - no user found');
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
              <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
              <p className="mt-2 text-sm text-gray-600">
                Verifying your authentication
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
              <h1 className="text-xl font-semibold text-gray-900">Access Denied</h1>
              <p className="mt-2 text-sm text-gray-600 text-center">
                You don't have permission to access this page. 
                Required role: {allowedRoles.join(", ")}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Your role: {user.role}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
