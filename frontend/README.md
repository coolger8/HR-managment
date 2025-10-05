# HR Management System - Frontend

Next.js frontend application for the HR Management System.

## 🏗️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/              # Next.js app router
│   ├── dashboard/    # Dashboard page
│   ├── login/        # Login page
│   ├── employees/    # Employee management pages
│   ├── departments/  # Department management pages
│   ├── attendance/   # Attendance pages
│   ├── leaves/       # Leave management pages
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page (redirects)
├── components/       # React components
│   ├── ui/           # Reusable UI components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
│   └── useAuth.tsx   # Authentication hook
├── api/              # API client functions
│   └── index.ts      # API endpoints
├── types/            # TypeScript definitions
│   └── index.ts      # Type definitions
└── lib/              # Utility functions
    └── utils.ts      # Utility functions
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
   npm run dev
   ```

3. **Access the application**
   - Development: http://localhost:3000
   - The app will redirect to login page if not authenticated

## 🎨 UI Components

### Custom Components
The application uses custom-built UI components with Tailwind CSS:

#### Button Component
```tsx
<Button variant="default" size="sm">
  Click me
</Button>
```

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
Sizes: `default`, `sm`, `lg`, `icon`

#### Input Component
```tsx
<Input 
  type="email" 
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

#### Card Components
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

## 🔐 Authentication

### Authentication Flow
1. User visits the app
2. `AuthProvider` checks for stored JWT token
3. If token exists, validates with backend
4. User is redirected to dashboard or login page accordingly

### useAuth Hook
```tsx
const { user, login, logout, isLoading } = useAuth();

// Login
await login({ username: 'user', password: 'pass' });

// Logout
logout();

// Check if user is authenticated
if (user) {
  // User is logged in
}
```

## 📱 Pages & Features

### Dashboard (`/dashboard`)
- Overview statistics
- Quick action buttons
- Recent activity feed
- Navigation to other modules

### Employee Management (`/employees`)
- Employee list with search and filters
- Add/edit employee forms
- Employee profile pages
- Department and position assignments

### Attendance Tracking (`/attendance`)
- Daily attendance overview
- Check-in/check-out functionality
- Attendance history
- Time tracking reports

### Leave Management (`/leaves`)
- Leave request forms
- Leave approval/rejection (for managers)
- Leave history and status
- Leave balance tracking

## 🌐 API Integration

### API Client Configuration
```typescript
// Base configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Usage Examples
```typescript
// Get all employees
const employees = await employeeAPI.getAll();

// Create new employee
const newEmployee = await employeeAPI.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@company.com'
});

// Check in attendance
await attendanceAPI.checkIn(employeeId, '09:00');
```

## 🎨 Styling

### Tailwind CSS
The application uses Tailwind CSS for styling with custom configuration:

```css
/* Custom color palette */
.text-primary { @apply text-blue-600; }
.bg-primary { @apply bg-blue-600; }
.border-primary { @apply border-blue-600; }
```

### Responsive Design
- Mobile-first approach
- Responsive navigation (sidebar collapses on mobile)
- Flexible grid layouts
- Touch-friendly interface elements

### Dark Mode Support
The application is prepared for dark mode implementation with Tailwind's dark mode utilities.

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# App Configuration
NEXT_PUBLIC_APP_NAME=HR Management System
```

### Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  // Enable if using images from external domains
  images: {
    domains: ['localhost'],
  },
};
```

## 🧪 Development

### Available Scripts
```bash
# Development
npm run dev           # Start development server

# Building
npm run build         # Build for production
npm run start         # Start production server

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
```

### Development Tools
- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting (configured via ESLint)
- **Tailwind CSS IntelliSense**: VSCode extension recommended

## 📊 State Management

### Authentication State
Managed through React Context API:
```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

### Local State
- React useState for component-level state
- Form state managed by React Hook Form
- API data managed through React Query (can be implemented)

## 🛡️ Security

### Security Features
- JWT token stored in localStorage
- Automatic token injection in API requests
- Route protection for authenticated pages
- XSS protection through React's built-in sanitization
- CSRF protection through SameSite cookies

### Best Practices
- Environment variables for configuration
- Input validation with Zod schemas
- Error boundary implementation
- Secure token storage considerations

## 📱 Mobile Responsiveness

### Mobile Features
- Responsive sidebar navigation
- Touch-friendly buttons and inputs
- Mobile-optimized forms
- Swipe gestures (can be implemented)
- Progressive Web App capabilities (can be implemented)

### Responsive Breakpoints
- `sm`: 640px and up
- `md`: 768px and up  
- `lg`: 1024px and up
- `xl`: 1280px and up

## 🚀 Performance

### Optimization Features
- Next.js App Router for efficient routing
- Automatic code splitting
- Image optimization with Next.js Image component
- Font optimization with Next.js Font optimization
- Turbopack for faster development builds

### Performance Monitoring
- Web Vitals measurement (can be implemented)
- Bundle analyzer (can be implemented)
- Performance profiling tools

## 🌍 Internationalization

The application structure supports internationalization:
- Prepared for multiple language support
- Date/time formatting with locale awareness
- Number formatting for different regions

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)