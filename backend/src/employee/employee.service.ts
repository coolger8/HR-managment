import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: ['department', 'position', 'manager'],
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'position', 'manager', 'attendances', 'leaves'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async create(employeeData: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepository.create(employeeData);
    return this.employeeRepository.save(employee);
  }

  async update(id: number, employeeData: Partial<Employee>): Promise<Employee> {
    await this.employeeRepository.update(id, employeeData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.employeeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }

  async findByDepartment(departmentId: number): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { departmentId },
      relations: ['department', 'position'],
    });
  }

  async findByManager(managerId: number): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { managerId },
      relations: ['department', 'position'],
    });
  }
}