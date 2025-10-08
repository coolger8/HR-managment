import { PartialType } from '@nestjs/mapped-types';
import { CreateOutsourcingEmployeeDto } from './create-outsourcing-employee.dto';

export class UpdateOutsourcingEmployeeDto extends PartialType(CreateOutsourcingEmployeeDto) {}