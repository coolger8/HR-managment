import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { Leave } from './leave.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@Body() createLeaveDto: Partial<Leave>) {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    if (status) {
      return this.leaveService.findByStatus(status);
    }
    return this.leaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveDto: Partial<Leave>) {
    return this.leaveService.update(+id, updateLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.leaveService.findByEmployee(+employeeId);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() approveDto: { approvedBy: number }) {
    return this.leaveService.approve(+id, approveDto.approvedBy);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() rejectDto: { rejectionReason: string }) {
    return this.leaveService.reject(+id, rejectDto.rejectionReason);
  }
}