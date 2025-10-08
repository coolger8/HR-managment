import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutsourcingCompany } from './outsourcing-company.entity';
import { CreateOutsourcingCompanyDto } from './dto/create-outsourcing-company.dto';
import { UpdateOutsourcingCompanyDto } from './dto/update-outsourcing-company.dto';

@Injectable()
export class OutsourcingCompanyService {
    constructor(
        @InjectRepository(OutsourcingCompany)
        private outsourcingCompanyRepository: Repository<OutsourcingCompany>,
    ) { }

    async findAll(): Promise<OutsourcingCompany[]> {
        return this.outsourcingCompanyRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<OutsourcingCompany> {
        const company = await this.outsourcingCompanyRepository.findOne({
            where: { id },
            relations: ['employees'],
        });

        if (!company) {
            throw new NotFoundException(`Outsourcing company with ID ${id} not found`);
        }

        return company;
    }

    async create(createDto: CreateOutsourcingCompanyDto): Promise<OutsourcingCompany> {
        const company = this.outsourcingCompanyRepository.create(createDto);
        return this.outsourcingCompanyRepository.save(company);
    }

    async update(id: number, updateDto: UpdateOutsourcingCompanyDto): Promise<OutsourcingCompany> {
        const company = await this.findOne(id);
        Object.assign(company, updateDto);
        return this.outsourcingCompanyRepository.save(company);
    }

    async remove(id: number): Promise<void> {
        const company = await this.findOne(id);
        await this.outsourcingCompanyRepository.remove(company);
    }
}