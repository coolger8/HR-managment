import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OutsourcingEmployee } from '../outsourcing-employee/outsourcing-employee.entity';

@Entity('outsourcing_companies')
export class OutsourcingCompany {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    contactPerson: string;

    @Column()
    contactEmail: string;

    @Column()
    contactPhone: string;

    @Column()
    address: string;

    @Column({ type: 'date' })
    contractStartDate: string;

    @Column({ type: 'date' })
    contractEndDate: string;

    @Column({ default: 'active' })
    status: string;

    @OneToMany(() => OutsourcingEmployee, employee => employee.company)
    employees: OutsourcingEmployee[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}