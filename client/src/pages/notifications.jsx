
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, FileText, Heart, CalendarDays, AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Mock notifications data - in a real app, this would come from your API
  const notifications = [
    {
      id: 1,
      type: "medical_report",
      title: "Blood Test Results Available",
      message: "Your recent blood work results are now available for review.",
      timestamp: "2025-01-06T10:30:00Z",
      isRead: false,
      priority: "high",
      icon: FileText,
      actionUrl: "/medical-records"
    },
    {
      id: 2,
      type: "appointment",
      title: "Upcoming Appointment Reminder",
      message: "You have an appointment with Dr. Sarah Wilson tomorrow at 2:30 PM.",
      timestamp: "2025-01-06T09:15:00Z",
      isRead: false,
      priority: "medium",
      icon: CalendarDays,
      actionUrl: "/dashboard/patient"
    },
    {
      id: 3,
      type: "health_metrics",
      title: "Weekly Health Summary",
      message: "Your blood pressure readings have been consistently good this week.",
      timestamp: "2025-01-05T18:00:00Z",
      isRead: true,
      priority: "low",
      icon: Heart,
      actionUrl: "/dashboard/patient"
    },
    {
      id: 4,
      type: "diet",
      title: "Nutrition Goal Achieved",
      message: "Congratulations! You've met your daily protein intake goal.",
      timestamp: "2025-01-05T16:45:00Z",
      isRead: true,
      priority: "low",
      icon: CheckCircle,
      actionUrl: "/dashboard/patient"
    },
    {
      id: 5,
      type: "routine_care",
      title: "Routine Checkup Due",
      message: "It's time for your annual physical examination. Please schedule an appointment.",
      timestamp: "2025-01-04T12:00:00Z",
      isRead: false,
      priority: "medium",
      icon: AlertCircle,
      actionUrl: "/appointment-booking"
    },
    {
      id: 6,
      type: "medical_report",
      title: "X-Ray Results Updated",
      message: "Dr. Rodriguez has added notes to your chest X-ray from last week.",
      timestamp: "2025-01-03T14:20:00Z",
      isRead: true,
      priority: "high",
      icon: FileText,
      actionUrl: "/medical-records"
    }
  ];

  const getNotificationsByType = (type) => {
    if (type === "all") return notifications;
    return notifications.filter(notification => notification.type === type);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[priority] || colors.low;
  };

  const getTypeIcon = (type) => {
    const icons = {
      medical_report: FileText,
      appointment: CalendarDays,
      health_metrics: Heart,
      diet: CheckCircle,
      routine_care: AlertCircle
    };
    return icons[type] || Bell;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId) => {
    // In a real app, this would update the notification in your database
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const deleteNotification = (notificationId) => {
    // In a real app, this would delete the notification from your database
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Stay updated with your health information and appointments
              </p>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="medical_report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="appointment" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="health_metrics" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Health
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Diet
            </TabsTrigger>
            <TabsTrigger value="routine_care" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Care
            </TabsTrigger>
          </TabsList>

          {["all", "medical_report", "appointment", "health_metrics", "diet", "routine_care"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {getNotificationsByType(tabValue).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg text-gray-500">No notifications found</p>
                    <p className="text-sm text-gray-400">You're all caught up!</p>
                  </CardContent>
                </Card>
              ) : (
                getNotificationsByType(tabValue).map((notification) => {
                  const IconComponent = getTypeIcon(notification.type);
                  return (
                    <Card 
                      key={notification.id} 
                      className={`transition-all duration-200 hover:shadow-md ${
                        !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`p-2 rounded-full ${
                              notification.isRead ? "bg-gray-100" : "bg-blue-100"
                            }`}>
                              <IconComponent className={`h-5 w-5 ${
                                notification.isRead ? "text-gray-600" : "text-blue-600"
                              }`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold ${
                                  notification.isRead ? "text-gray-700" : "text-gray-900"
                                }`}>
                                  {notification.title}
                                </h3>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority}
                                </Badge>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                              
                              <p className={`text-sm ${
                                notification.isRead ? "text-gray-500" : "text-gray-600"
                              } mb-2`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center text-xs text-gray-400 gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Mark as read
                              </Button>
                            )}
                            
                            {notification.actionUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = notification.actionUrl}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                View
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
