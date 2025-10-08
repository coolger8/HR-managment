import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutsourcingEmployee } from './outsourcing-employee.entity';
import { CreateOutsourcingEmployeeDto } from './dto/create-outsourcing-employee.dto';
import { UpdateOutsourcingEmployeeDto } from './dto/update-outsourcing-employee.dto';

@Injectable()
export class OutsourcingEmployeeService {
    constructor(
        @InjectRepository(OutsourcingEmployee)
        private outsourcingEmployeeRepository: Repository<OutsourcingEmployee>,
    ) { }

    async findAll(): Promise<OutsourcingEmployee[]> {
        return this.outsourcingEmployeeRepository.find({
            relations: ['company'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<OutsourcingEmployee> {
        const employee = await this.outsourcingEmployeeRepository.findOne({
            where: { id },
            relations: ['company'],
        });

        if (!employee) {
            throw new NotFoundException(`Outsourcing employee with ID ${id} not found`);
        }

        return employee;
    }

    async findByCompany(companyId: number): Promise<OutsourcingEmployee[]> {
        return this.outsourcingEmployeeRepository.find({
            where: { companyId },
            relations: ['company'],
            order: { createdAt: 'DESC' },
        });
    }

    async create(createDto: CreateOutsourcingEmployeeDto): Promise<OutsourcingEmployee> {
        const employee = this.outsourcingEmployeeRepository.create(createDto);
        return this.outsourcingEmployeeRepository.save(employee);
    }

    async update(id: number, updateDto: UpdateOutsourcingEmployeeDto): Promise<OutsourcingEmployee> {
        const employee = await this.findOne(id);
        Object.assign(employee, updateDto);
        return this.outsourcingEmployeeRepository.save(employee);
    }

    async remove(id: number): Promise<void> {
        const employee = await this.findOne(id);
        await this.outsourcingEmployeeRepository.remove(employee);
    }
}