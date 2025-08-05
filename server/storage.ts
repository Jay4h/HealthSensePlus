import { 
  type User, 
  type InsertUser, 
  type Appointment, 
  type InsertAppointment,
  type MedicalRecord,
  type InsertMedicalRecord,
  type HealthMetrics,
  type InsertHealthMetrics,
  type ContactMessage,
  type InsertContactMessage,
  type Feedback,
  type InsertFeedback
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUsersByRole(role: string): Promise<User[]>;
  getAllUsers(): Promise<User[]>;

  // Appointment operations
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;

  // Medical Record operations
  getMedicalRecord(id: string): Promise<MedicalRecord | undefined>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: string, updates: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined>;
  getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]>;
  getMedicalRecordsByDoctor(doctorId: string): Promise<MedicalRecord[]>;

  // Health Metrics operations
  getHealthMetrics(id: string): Promise<HealthMetrics | undefined>;
  createHealthMetrics(metrics: InsertHealthMetrics): Promise<HealthMetrics>;
  getHealthMetricsByPatient(patientId: string): Promise<HealthMetrics[]>;

  // Contact Message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  updateContactMessageStatus(id: string, status: string): Promise<ContactMessage | undefined>;

  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedback(): Promise<Feedback[]>;
  getFeedbackByUser(userId: string): Promise<Feedback[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private appointments: Map<string, Appointment>;
  private medicalRecords: Map<string, MedicalRecord>;
  private healthMetrics: Map<string, HealthMetrics>;
  private contactMessages: Map<string, ContactMessage>;
  private feedbacks: Map<string, Feedback>;

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();
    this.healthMetrics = new Map();
    this.contactMessages = new Map();
    this.feedbacks = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Appointment operations
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const now = new Date();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment: Appointment = { 
      ...appointment, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.patientId === patientId);
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.doctorId === doctorId);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.appointmentDate === date);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  // Medical Record operations
  async getMedicalRecord(id: string): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = randomUUID();
    const now = new Date();
    const record: MedicalRecord = { 
      ...insertRecord, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.medicalRecords.set(id, record);
    return record;
  }

  async updateMedicalRecord(id: string, updates: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined> {
    const record = this.medicalRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord: MedicalRecord = { 
      ...record, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.medicalRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(record => record.patientId === patientId);
  }

  async getMedicalRecordsByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(record => record.doctorId === doctorId);
  }

  // Health Metrics operations
  async getHealthMetrics(id: string): Promise<HealthMetrics | undefined> {
    return this.healthMetrics.get(id);
  }

  async createHealthMetrics(insertMetrics: InsertHealthMetrics): Promise<HealthMetrics> {
    const id = randomUUID();
    const metrics: HealthMetrics = { 
      ...insertMetrics, 
      id,
      createdAt: new Date()
    };
    this.healthMetrics.set(id, metrics);
    return metrics;
  }

  async getHealthMetricsByPatient(patientId: string): Promise<HealthMetrics[]> {
    return Array.from(this.healthMetrics.values()).filter(metrics => metrics.patientId === patientId);
  }

  // Contact Message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async updateContactMessageStatus(id: string, status: string): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage: ContactMessage = { 
      ...message, 
      status 
    };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Feedback operations
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = { 
      ...insertFeedback, 
      id,
      createdAt: new Date()
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values());
  }

  async getFeedbackByUser(userId: string): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(feedback => feedback.userId === userId);
  }
}

export const storage = new MemStorage();
