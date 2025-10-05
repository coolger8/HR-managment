import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: Partial<Attendance>) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (startDate && endDate) {
      return this.attendanceService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    return this.attendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: Partial<Attendance>) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.attendanceService.findByEmployee(+employeeId);
  }

  @Post('check-in')
  checkIn(@Body() checkInDto: { employeeId: number; checkInTime: string }) {
    return this.attendanceService.checkIn(checkInDto.employeeId, checkInDto.checkInTime);
  }

  @Post('check-out')
  checkOut(@Body() checkOutDto: { employeeId: number; checkOutTime: string }) {
    return this.attendanceService.checkOut(checkOutDto.employeeId, checkOutDto.checkOutTime);
  }
}