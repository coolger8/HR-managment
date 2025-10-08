import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutsourcingCompany } from './outsourcing-company.entity';
import { OutsourcingCompanyController } from './outsourcing-company.controller';
import { OutsourcingCompanyService } from './outsourcing-company.service';

@Module({
    imports: [TypeOrmModule.forFeature([OutsourcingCompany])],
    controllers: [OutsourcingCompanyController],
    providers: [OutsourcingCompanyService],
    exports: [OutsourcingCompanyService],
})
export class OutsourcingCompanyModule { }