import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutsourcingEmployee } from './outsourcing-employee.entity';
import { OutsourcingEmployeeController } from './outsourcing-employee.controller';
import { OutsourcingEmployeeService } from './outsourcing-employee.service';

@Module({
    imports: [TypeOrmModule.forFeature([OutsourcingEmployee])],
    controllers: [OutsourcingEmployeeController],
    providers: [OutsourcingEmployeeService],
    exports: [OutsourcingEmployeeService],
})
export class OutsourcingEmployeeModule { }