import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OutsourcingEmployeeService } from './outsourcing-employee.service';
import { CreateOutsourcingEmployeeDto } from './dto/create-outsourcing-employee.dto';
import { UpdateOutsourcingEmployeeDto } from './dto/update-outsourcing-employee.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('outsourcing-employees')
@UseGuards(JwtAuthGuard)
export class OutsourcingEmployeeController {
    constructor(private readonly outsourcingEmployeeService: OutsourcingEmployeeService) { }

    @Get()
    findAll() {
        return this.outsourcingEmployeeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.outsourcingEmployeeService.findOne(+id);
    }

    @Get('company/:companyId')
    findByCompany(@Param('companyId') companyId: string) {
        return this.outsourcingEmployeeService.findByCompany(+companyId);
    }

    @Post()
    create(@Body() createDto: CreateOutsourcingEmployeeDto) {
        return this.outsourcingEmployeeService.create(createDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateOutsourcingEmployeeDto) {
        return this.outsourcingEmployeeService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.outsourcingEmployeeService.remove(+id);
    }
}