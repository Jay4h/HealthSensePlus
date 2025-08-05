# HealthSensePlus Healthcare Management System

## Overview

HealthSensePlus is a comprehensive healthcare management system built with modern web technologies. It's a full-stack application that provides role-based access control for patients, doctors, nurses, and administrators. The system handles appointment scheduling, medical records management, health metrics tracking, and communication between healthcare providers and patients.

The application uses a monorepo structure with separate client and server directories, shared schema definitions, and a PostgreSQL database with Drizzle ORM for type-safe database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management with custom query client configuration
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom healthcare-themed color variables and CSS custom properties
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Authentication**: JWT-based authentication with role-based route protection

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **API Structure**: RESTful endpoints with role-based authorization middleware
- **Session Management**: Express sessions with PostgreSQL session store
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Centralized schema definitions in shared directory with Zod validation
- **Tables**: Users, appointments, medical records, health metrics, contact messages, and feedback
- **Relationships**: Foreign key relationships between users, appointments, and medical records
- **Validation**: Runtime validation using Drizzle-Zod integration

### Authentication & Authorization
- **Multi-role System**: Patient, Doctor, Admin, and Nurse roles with different access levels
- **JWT Implementation**: Token-based authentication with configurable secret key
- **Route Protection**: Protected routes component that checks user roles before allowing access
- **Password Security**: bcryptjs hashing with salt rounds for secure password storage

### Development Setup
- **Build System**: Vite for frontend development with React plugin and error overlay
- **TypeScript**: Strict TypeScript configuration with path mapping for clean imports
- **Code Quality**: ESLint and Prettier configuration for consistent code formatting
- **Development Tools**: Hot module replacement, runtime error overlay, and development banners

## External Dependencies

### Database & Storage
- **PostgreSQL**: Primary database using Neon Database serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations with automatic migration generation
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form for form management
- **UI Framework**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach
- **State Management**: TanStack React Query for server state and caching
- **Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for date manipulation and formatting utilities

### Backend Dependencies
- **Express.js**: Web framework with middleware for routing and request handling
- **Security**: bcryptjs for password hashing, JWT for token authentication
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Validation**: Zod for API request/response validation and type safety

### Development Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Type checking and compilation for both frontend and backend
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Build Tools**: esbuild for backend bundling, PostCSS for CSS processing