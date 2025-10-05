import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  checkIn: string;

  @Column({ type: 'time', nullable: true })
  checkOut: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  hoursWorked: number;

  @Column({ default: 'present' })
  status: string; // 'present', 'absent', 'late', 'half-day'

  @Column({ nullable: true })
  notes: string;

  @Column()
  employeeId: number;

  @ManyToOne(() => Employee, employee => employee.attendances)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;
}