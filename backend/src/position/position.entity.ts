import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minSalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxSalary: number;

  @Column({ nullable: true })
  requirements: string;

  @OneToMany(() => Employee, employee => employee.position)
  employees: Employee[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}