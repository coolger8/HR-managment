import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OutsourcingCompany } from '../outsourcing-company/outsourcing-company.entity';

@Entity('outsourcing_employees')
export class OutsourcingEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  position: string;

  @Column()
  companyId: number;

  @ManyToOne(() => OutsourcingCompany, company => company.employees)
  @JoinColumn({ name: 'companyId' })
  company: OutsourcingCompany;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}