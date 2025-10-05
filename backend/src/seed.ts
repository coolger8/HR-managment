import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { DepartmentService } from './department/department.service';
import { PositionService } from './position/position.service';
import { EmployeeService } from './employee/employee.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);
  const departmentService = app.get(DepartmentService);
  const positionService = app.get(PositionService);
  const employeeService = app.get(EmployeeService);

  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    try {
      const adminUser = await authService.register({
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created:', adminUser.username);
    } catch (error) {
      console.log('ℹ️ Admin user already exists');
    }

    // Create HR user
    try {
      const hrUser = await authService.register({
        username: 'hr',
        email: 'hr@company.com',
        password: 'hr123',
        role: 'hr'
      });
      console.log('✅ HR user created:', hrUser.username);
    } catch (error) {
      console.log('ℹ️ HR user already exists');
    }

    // Create sample departments
    try {
      const departments = [
        { name: 'Human Resources', description: 'HR Department', location: 'Building A' },
        { name: 'Engineering', description: 'Software Development', location: 'Building B' },
        { name: 'Marketing', description: 'Marketing and Sales', location: 'Building C' },
        { name: 'Finance', description: 'Financial Operations', location: 'Building A' }
      ];

      for (const dept of departments) {
        try {
          const department = await departmentService.create(dept);
          console.log('✅ Department created:', department.name);
        } catch (error) {
          console.log(`ℹ️ Department ${dept.name} already exists`);
        }
      }
    } catch (error) {
      console.log('Error creating departments:', error.message);
    }

    // Create sample positions
    try {
      const positions = [
        { title: 'Software Engineer', description: 'Full-stack developer', minSalary: 60000, maxSalary: 100000 },
        { title: 'HR Manager', description: 'Human Resources Manager', minSalary: 70000, maxSalary: 90000 },
        { title: 'Marketing Specialist', description: 'Marketing professional', minSalary: 45000, maxSalary: 70000 },
        { title: 'Financial Analyst', description: 'Financial analysis and reporting', minSalary: 55000, maxSalary: 80000 }
      ];

      for (const pos of positions) {
        try {
          const position = await positionService.create(pos);
          console.log('✅ Position created:', position.title);
        } catch (error) {
          console.log(`ℹ️ Position ${pos.title} already exists`);
        }
      }
    } catch (error) {
      console.log('Error creating positions:', error.message);
    }

    // Create sample employees
    try {
      const employees = [
        {
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1234567890',
          dateOfBirth: new Date('1990-01-15'),
          hireDate: new Date('2023-01-01'),
          salary: 75000,
          address: '123 Main St, City, State',
          departmentId: 2, // Engineering
          positionId: 1,   // Software Engineer
        },
        {
          employeeId: 'EMP002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@company.com',
          phone: '+1234567891',
          dateOfBirth: new Date('1988-03-22'),
          hireDate: new Date('2023-02-15'),
          salary: 80000,
          address: '456 Oak Ave, City, State',
          departmentId: 1, // HR
          positionId: 2,   // HR Manager
        }
      ];

      for (const emp of employees) {
        try {
          const employee = await employeeService.create(emp);
          console.log('✅ Employee created:', `${employee.firstName} ${employee.lastName}`);
        } catch (error) {
          console.log(`ℹ️ Employee ${emp.firstName} ${emp.lastName} already exists`);
        }
      }
    } catch (error) {
      console.log('Error creating employees:', error.message);
    }

    console.log('🎉 Database seeding completed!');
    console.log('\n📝 Test credentials:');
    console.log('Admin: username="admin", password="admin123"');
    console.log('HR: username="hr", password="hr123"');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await app.close();
  }
}

seed();