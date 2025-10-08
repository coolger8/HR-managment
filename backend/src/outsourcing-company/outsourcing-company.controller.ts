import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OutsourcingCompanyService } from './outsourcing-company.service';
import { CreateOutsourcingCompanyDto } from './dto/create-outsourcing-company.dto';
import { UpdateOutsourcingCompanyDto } from './dto/update-outsourcing-company.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('outsourcing-companies')
@UseGuards(JwtAuthGuard)
export class OutsourcingCompanyController {
    constructor(private readonly outsourcingCompanyService: OutsourcingCompanyService) { }

    @Get()
    findAll() {
        return this.outsourcingCompanyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.outsourcingCompanyService.findOne(+id);
    }

    @Post()
    create(@Body() createDto: CreateOutsourcingCompanyDto) {
        return this.outsourcingCompanyService.create(createDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateOutsourcingCompanyDto) {
        return this.outsourcingCompanyService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.outsourcingCompanyService.remove(+id);
    }
}