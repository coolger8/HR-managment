import { IsString, IsEmail, IsNotEmpty, IsDateString, IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOutsourcingEmployeeDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    position: string;

    @IsNumber()
    @IsNotEmpty()
    companyId: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsIn(['active', 'inactive', 'completed'])
    status: string;

    @IsNumber()
    @Min(0)
    dailyRate: number;
}