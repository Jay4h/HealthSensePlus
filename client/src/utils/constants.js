export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  NURSE: 'nurse',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
};

export const COLORS = {
  MEDICAL_BLUE: {
    50: 'hsl(214, 100%, 97%)',
    100: 'hsl(214, 95%, 93%)', 
    500: 'hsl(213, 83%, 50%)',
    600: 'hsl(213, 83%, 45%)',
    700: 'hsl(213, 75%, 40%)',
  },
  HEALING_GREEN: {
    50: 'hsl(151, 81%, 96%)',
    100: 'hsl(149, 80%, 90%)',
    500: 'hsl(158, 94%, 40%)',
    600: 'hsl(158, 94%, 35%)',
    700: 'hsl(158, 94%, 30%)',
  },
  HEALTHCARE_ORANGE: {
    50: 'hsl(48, 100%, 93%)',
    100: 'hsl(48, 96%, 89%)',
    400: 'hsl(43, 96%, 66%)',
    500: 'hsl(43, 96%, 56%)',
    600: 'hsl(36, 95%, 50%)',
  },
};

export const CONTACT_SUBJECTS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'appointment', label: 'Appointment Issue' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'feature', label: 'Feature Request' },
];

export const INSURANCE_PROVIDERS = [
  { value: 'blue-cross', label: 'Blue Cross Blue Shield' },
  { value: 'aetna', label: 'Aetna' },
  { value: 'cigna', label: 'Cigna' },
  { value: 'self-pay', label: 'Self-Pay' },
];

export const APPOINTMENT_REASONS = [
  { value: 'routine-checkup', label: 'Routine Checkup' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'new-patient', label: 'New Patient' },
  { value: 'urgent-care', label: 'Urgent Care' },
  { value: 'consultation', label: 'Consultation' },
];

export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology', 
  'Endocrinology',
  'Family Medicine',
  'Internal Medicine',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/users/profile',
  },
  USERS: '/api/users',
  APPOINTMENTS: '/api/appointments',
  MEDICAL_RECORDS: '/api/medical-records',
  HEALTH_METRICS: '/api/health-metrics',
  CONTACT: '/api/contact',
  FEEDBACK: '/api/feedback',
  ANALYTICS: '/api/analytics/dashboard-stats',
};

export const EMERGENCY_CONTACTS = {
  EMERGENCY: '(555) 911-1234',
  GENERAL: '(555) 123-4567',
  EMAIL: 'info@healthsenseplus.com',
  SUPPORT_EMAIL: 'support@healthsenseplus.com',
};

export const OFFICE_HOURS = {
  WEEKDAYS: 'Monday - Friday: 8:00 AM - 6:00 PM',
  SATURDAY: 'Saturday: 9:00 AM - 4:00 PM', 
  SUNDAY: 'Sunday: Emergency Only',
};
