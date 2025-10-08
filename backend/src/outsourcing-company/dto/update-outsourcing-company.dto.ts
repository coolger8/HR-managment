import { PartialType } from '@nestjs/mapped-types';
import { CreateOutsourcingCompanyDto } from './create-outsourcing-company.dto';

export class UpdateOutsourcingCompanyDto extends PartialType(CreateOutsourcingCompanyDto) { }