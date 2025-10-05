# HR Management System

A comprehensive Human Resources Management System built with modern web technologies.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **Authentication**: JWT tokens with Passport.js

## 📁 Project Structure

```
HR-managment/
├── backend/          # NestJS backend application
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── employee/ # Employee management
│   │   ├── department/ # Department management
│   │   ├── attendance/ # Attendance tracking
│   │   ├── leave/    # Leave management
│   │   ├── position/ # Job positions
│   │   └── common/   # Shared utilities
│   └── package.json
├── frontend/         # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js app router pages
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/    # Custom React hooks
│   │   ├── api/      # API client functions
│   │   └── types/    # TypeScript type definitions
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   cd HR-managment
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   Backend will be running at: http://localhost:3001

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will be running at: http://localhost:3000

4. **Access the Application**
   - Open your browser and go to http://localhost:3000
   - You'll be redirected to the login page
   - Create a new account or use test credentials (if seeded)

## 📋 Features

### 👥 Employee Management
- Add, edit, and delete employee records
- Employee profile with personal and professional details
- Department and position assignments
- Manager hierarchy

### 🏢 Department Management
- Create and manage departments
- Assign department managers
- View department employee lists

### 🕐 Attendance Tracking
- Daily check-in/check-out
- Attendance history
- Working hours calculation
- Attendance reports

### 🗓️ Leave Management
- Leave request submission
- Approval workflow
- Leave type categorization (vacation, sick, personal, etc.)
- Leave balance tracking

### 📊 Dashboard & Reports
- Overview statistics
- Quick actions
- Recent activities
- Attendance and leave reports

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, HR, Manager, Employee)
- Secure API endpoints

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PATCH /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `GET /api/departments/:id` - Get department by ID
- `PATCH /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/employee/:id` - Get employee attendance

### Leave Management
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Submit leave request
- `POST /api/leaves/:id/approve` - Approve leave
- `POST /api/leaves/:id/reject` - Reject leave

## 🏗️ Database Schema

### Key Entities
- **Users**: System authentication
- **Employees**: Employee information
- **Departments**: Organization structure
- **Positions**: Job roles
- **Attendance**: Time tracking
- **Leaves**: Leave requests

## 🧪 Development

### Backend Development
```bash
cd backend
npm run start:dev  # Development mode with hot reload
npm run build      # Build for production
npm run start:prod # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev        # Development mode
npm run build      # Build for production
npm run start      # Run production build
```

## 🔧 Configuration

### Environment Variables

**Backend** (create `.env` file in backend folder):
```env
JWT_SECRET=your-jwt-secret-key
DATABASE_PATH=./hr_management.db
```

**Frontend** (create `.env.local` file in frontend folder):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.