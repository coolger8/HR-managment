import { IsString, IsEmail, IsNotEmpty, IsDateString, IsIn } from 'class-validator';

export class CreateOutsourcingCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    contactPerson: string;

    @IsEmail()
    @IsNotEmpty()
    contactEmail: string;

    @IsString()
    @IsNotEmpty()
    contactPhone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsDateString()
    @IsNotEmpty()
    contractStartDate: string;

    @IsDateString()
    @IsNotEmpty()
    contractEndDate: string;

    @IsString()
    @IsIn(['active', 'inactive', 'suspended'])
    status: string;
}