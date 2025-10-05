import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';

// Entity imports
import { User } from './auth/user.entity';
import { Employee } from './employee/employee.entity';
import { Department } from './department/department.entity';
import { Position } from './position/position.entity';
import { Attendance } from './attendance/attendance.entity';
import { Leave } from './leave/leave.entity';

// Module imports
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Employee, Department, Position, Attendance, Leave]),
    AuthModule,
    EmployeeModule,
    DepartmentModule,
    PositionModule,
    AttendanceModule,
    LeaveModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}