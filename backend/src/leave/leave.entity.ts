import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('leaves')
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  type: string; // 'vacation', 'sick', 'personal', 'maternity', 'paternity'

  @Column()
  reason: string;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'approved', 'rejected'

  @Column({ nullable: true })
  approvedBy: number;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  daysRequested: number;

  @Column()
  employeeId: number;

  @ManyToOne(() => Employee, employee => employee.leaves)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}