# HR Management System - Backend

NestJS backend application for the HR Management System.

## 🏗️ Technology Stack

- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: SQLite with better-sqlite3
- **ORM**: TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator, class-transformer

## 📁 Project Structure

```
src/
├── auth/           # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── user.entity.ts
│   ├── local.strategy.ts
│   └── jwt.strategy.ts
├── employee/       # Employee management
│   ├── employee.controller.ts
│   ├── employee.service.ts
│   ├── employee.module.ts
│   └── employee.entity.ts
├── department/     # Department management
├── attendance/     # Attendance tracking
├── leave/          # Leave management
├── position/       # Job positions
├── common/         # Shared utilities
│   └── guards/     # Authentication guards
├── config/         # Configuration files
│   └── database.config.ts
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run start:dev
   ```

3. **Access the API**
   - Base URL: http://localhost:3001
   - API Prefix: `/api`
   - Swagger docs: http://localhost:3001/api (if enabled)

## 📊 Database

### Database Configuration
The application uses SQLite database with the following configuration:
- Database file: `./hr_management.db`
- Auto-synchronization: Enabled (development only)
- Logging: Enabled

### Entities

#### User Entity
```typescript
- id: number (Primary Key)
- username: string (Unique)
- email: string (Unique)
- password: string (Hashed)
- role: string (admin, hr, manager, employee)
- isActive: boolean
- createdAt: Date
- updatedAt: Date
```

#### Employee Entity
```typescript
- id: number (Primary Key)
- employeeId: string
- firstName: string
- lastName: string
- email: string (Unique)
- phone: string
- dateOfBirth: Date
- hireDate: Date
- salary: number
- address: string
- emergencyContact: string
- emergencyPhone: string
- departmentId: number (Foreign Key)
- positionId: number (Foreign Key)
- managerId: number (Foreign Key)
- status: string (active, inactive, terminated)
```

## 🔐 Authentication

### JWT Configuration
- Secret: Configurable via environment variables
- Expiration: 1 day
- Strategy: JWT Bearer token

### User Roles
- **admin**: Full system access
- **hr**: HR operations access
- **manager**: Team management access
- **employee**: Limited access to own data

### Protected Routes
Most endpoints require authentication. Use the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## 📝 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "employee" // optional
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Employee Endpoints

#### Get All Employees
```http
GET /api/employees
Authorization: Bearer <token>
```

#### Create Employee
```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "hireDate": "2023-01-01",
  "salary": 50000,
  "departmentId": 1,
  "positionId": 1
}
```

### Attendance Endpoints

#### Check In
```http
POST /api/attendance/check-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1,
  "checkInTime": "09:00"
}
```

#### Check Out
```http
POST /api/attendance/check-out
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1,
  "checkOutTime": "17:00"
}
```

## 🧪 Development

### Available Scripts
```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debugger

# Building
npm run build          # Build for production
npm run start:prod     # Run production build

# Testing
npm run test           # Run unit tests
npm run test:e2e       # Run e2e tests
npm run test:cov       # Run tests with coverage
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend root:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Database
DATABASE_PATH=./hr_management.db

# Application
PORT=3001
```

### CORS Configuration
CORS is configured to allow requests from the frontend:
- Origin: http://localhost:3000
- Credentials: Enabled

## 🚦 Error Handling

The application includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Internal server errors (500)

## 📈 Performance

### Database Optimizations
- Indexed columns for faster queries
- Relationship loading optimization
- Connection pooling

### Caching
- JWT token validation caching
- Database query result caching (can be implemented)

## 🛡️ Security

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation and sanitization
- SQL injection prevention through TypeORM

### Best Practices
- Environment variables for sensitive data
- Proper error handling without information leakage
- Role-based access control
- Request rate limiting (can be implemented)

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Passport.js Documentation](http://www.passportjs.org/)