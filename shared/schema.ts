import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'patient', 'doctor', 'admin', 'nurse'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  address: jsonb("address"),
  profileImage: text("profile_image"),
  isActive: boolean("is_active").default(true),
  specialization: text("specialization"), // for doctors
  licenseNumber: text("license_number"), // for doctors
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: varchar("doctor_id").references(() => users.id).notNull(),
  appointmentDate: text("appointment_date").notNull(),
  timeSlot: text("time_slot").notNull(),
  status: text("status").notNull().default("scheduled"), // 'scheduled', 'completed', 'cancelled', 'rescheduled'
  reason: text("reason"),
  notes: text("notes"),
  insuranceProvider: text("insurance_provider"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  doctorId: varchar("doctor_id").references(() => users.id).notNull(),
  appointmentId: varchar("appointment_id").references(() => appointments.id),
  visitDate: text("visit_date").notNull(),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  prescription: jsonb("prescription"),
  labResults: jsonb("lab_results"),
  vitals: jsonb("vitals"),
  notes: text("notes"),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const healthMetrics = pgTable("health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => users.id).notNull(),
  bloodPressure: text("blood_pressure"),
  heartRate: integer("heart_rate"),
  weight: text("weight"),
  temperature: text("temperature"),
  height: text("height"),
  bloodType: text("blood_type"),
  allergies: jsonb("allergies"),
  emergencyContact: jsonb("emergency_contact"),
  recordedDate: text("recorded_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"), // 'new', 'read', 'responded'
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  category: text("category"), // 'service', 'system', 'doctor', 'general'
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthMetricsSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;

export type InsertHealthMetrics = z.infer<typeof insertHealthMetricsSchema>;
export type HealthMetrics = typeof healthMetrics.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
