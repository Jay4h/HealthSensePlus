import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertAppointmentSchema, insertMedicalRecordSchema, insertHealthMetricsSchema, insertContactMessageSchema, insertFeedbackSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "healthcare-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware to check user role
const authorizeRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userResponse } = user;
      
      res.status(201).json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userResponse } = user;
      
      res.json({ token, user: userResponse });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  // User Routes
  app.get("/api/users/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile", error });
    }
  });

  app.put("/api/users/profile", authenticateToken, async (req: any, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Don't allow password updates through this route
      
      const user = await storage.updateUser(req.user.userId, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile", error });
    }
  });

  app.get("/api/users", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
      const { role } = req.query;
      let users;
      
      if (role) {
        users = await storage.getUsersByRole(role as string);
      } else {
        users = await storage.getAllUsers();
      }
      
      // Remove passwords from response
      const usersResponse = users.map(({ password, ...user }) => user);
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users", error });
    }
  });

  // Appointment Routes
  app.get("/api/appointments", authenticateToken, async (req: any, res) => {
    try {
      let appointments;
      
      if (req.user.role === 'patient') {
        appointments = await storage.getAppointmentsByPatient(req.user.userId);
      } else if (req.user.role === 'doctor') {
        appointments = await storage.getAppointmentsByDoctor(req.user.userId);
      } else if (req.user.role === 'admin' || req.user.role === 'nurse') {
        appointments = await storage.getAllAppointments();
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get appointments", error });
    }
  });

  app.post("/api/appointments", authenticateToken, async (req: any, res) => {
    try {
      let appointmentData = insertAppointmentSchema.parse(req.body);
      
      // If user is patient, set patientId to their own ID
      if (req.user.role === 'patient') {
        appointmentData.patientId = req.user.userId;
      }
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Invalid appointment data", error });
    }
  });

  app.put("/api/appointments/:id", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const appointment = await storage.updateAppointment(id, updates);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment", error });
    }
  });

  // Available time slots (mock implementation)
  app.get("/api/appointments/available-slots", authenticateToken, async (req, res) => {
    try {
      const { doctorId, date } = req.query;
      
      // Get existing appointments for the doctor on that date
      const existingAppointments = await storage.getAppointmentsByDate(date as string);
      const doctorAppointments = existingAppointments.filter(apt => apt.doctorId === doctorId);
      
      // Generate available slots (9 AM to 5 PM, excluding booked ones)
      const allSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
      ];
      
      const bookedSlots = doctorAppointments.map(apt => apt.timeSlot);
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
      
      res.json(availableSlots);
    } catch (error) {
      res.status(500).json({ message: "Failed to get available slots", error });
    }
  });

  // Medical Records Routes
  app.get("/api/medical-records", authenticateToken, async (req: any, res) => {
    try {
      let records;
      
      if (req.user.role === 'patient') {
        records = await storage.getMedicalRecordsByPatient(req.user.userId);
      } else if (req.user.role === 'doctor') {
        const { patientId } = req.query;
        if (patientId) {
          records = await storage.getMedicalRecordsByPatient(patientId as string);
        } else {
          records = await storage.getMedicalRecordsByDoctor(req.user.userId);
        }
      } else if (req.user.role === 'admin' || req.user.role === 'nurse') {
        const { patientId } = req.query;
        if (patientId) {
          records = await storage.getMedicalRecordsByPatient(patientId as string);
        } else {
          // Return all records for admin/nurse would be too much, require patientId
          return res.status(400).json({ message: "patientId parameter required" });
        }
      }
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to get medical records", error });
    }
  });

  app.post("/api/medical-records", authenticateToken, authorizeRole(['doctor', 'nurse']), async (req: any, res) => {
    try {
      const recordData = insertMedicalRecordSchema.parse(req.body);
      
      // Set doctorId to current user if they're a doctor
      if (req.user.role === 'doctor') {
        recordData.doctorId = req.user.userId;
      }
      
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid medical record data", error });
    }
  });

  app.put("/api/medical-records/:id", authenticateToken, authorizeRole(['doctor', 'nurse']), async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const record = await storage.updateMedicalRecord(id, updates);
      if (!record) {
        return res.status(404).json({ message: "Medical record not found" });
      }
      
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to update medical record", error });
    }
  });

  // Health Metrics Routes
  app.get("/api/health-metrics", authenticateToken, async (req: any, res) => {
    try {
      const { patientId } = req.query;
      let targetPatientId = patientId as string;
      
      // If user is patient, only allow access to their own metrics
      if (req.user.role === 'patient') {
        targetPatientId = req.user.userId;
      }
      
      if (!targetPatientId) {
        return res.status(400).json({ message: "patientId parameter required" });
      }
      
      const metrics = await storage.getHealthMetricsByPatient(targetPatientId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get health metrics", error });
    }
  });

  app.post("/api/health-metrics", authenticateToken, async (req: any, res) => {
    try {
      let metricsData = insertHealthMetricsSchema.parse(req.body);
      
      // If user is patient, set patientId to their own ID
      if (req.user.role === 'patient') {
        metricsData.patientId = req.user.userId;
      }
      
      const metrics = await storage.createHealthMetrics(metricsData);
      res.status(201).json(metrics);
    } catch (error) {
      res.status(400).json({ message: "Invalid health metrics data", error });
    }
  });

  // Contact Messages Routes
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact message data", error });
    }
  });

  app.get("/api/contact", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contact messages", error });
    }
  });

  // Feedback Routes
  app.post("/api/feedback", authenticateToken, async (req: any, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback data", error });
    }
  });

  app.get("/api/feedback", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to get feedback", error });
    }
  });

  // Dashboard Analytics Routes
  app.get("/api/analytics/dashboard-stats", authenticateToken, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      const appointments = await storage.getAllAppointments();
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = await storage.getAppointmentsByDate(today);
      
      const stats = {
        totalUsers: users.length,
        totalPatients: users.filter(u => u.role === 'patient').length,
        totalDoctors: users.filter(u => u.role === 'doctor').length,
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        activeUsers: users.filter(u => u.isActive).length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard stats", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
