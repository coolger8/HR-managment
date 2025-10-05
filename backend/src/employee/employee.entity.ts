import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: string; // Unique employee identifier

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  // Department relationship
  @ManyToOne('Department', 'employees')
  @JoinColumn({ name: 'departmentId' })
  department: any;

  @Column({ nullable: true })
  departmentId: number;

  // Position relationship
  @ManyToOne('Position', 'employees')
  @JoinColumn({ name: 'positionId' })
  position: any;

  @Column({ nullable: true })
  positionId: number;

  // Manager relationship (self-referencing)
  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: Employee;

  @Column({ nullable: true })
  managerId: number;

  // Attendance records
  @OneToMany('Attendance', 'employee')
  attendances: any[];

  // Leave records
  @OneToMany('Leave', 'employee')
  leaves: any[];

  @Column({ default: 'active' })
  status: string; // 'active', 'inactive', 'terminated'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}