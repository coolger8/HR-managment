import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['employee'],
    });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async create(attendanceData: Partial<Attendance>): Promise<Attendance> {
    const attendance = this.attendanceRepository.create(attendanceData);
    return this.attendanceRepository.save(attendance);
  }

  async update(id: number, attendanceData: Partial<Attendance>): Promise<Attendance> {
    await this.attendanceRepository.update(id, attendanceData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
  }

  async findByEmployee(employeeId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { employeeId },
      order: { date: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['employee'],
      order: { date: 'DESC' },
    });
  }

  async checkIn(employeeId: number, checkInTime: string): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (existingAttendance) {
      existingAttendance.checkIn = checkInTime;
      return this.attendanceRepository.save(existingAttendance);
    }

    const attendance = this.attendanceRepository.create({
      employeeId,
      date: today,
      checkIn: checkInTime,
      status: 'present',
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(employeeId: number, checkOutTime: string): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.attendanceRepository.findOne({
      where: { employeeId, date: today },
    });

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    attendance.checkOut = checkOutTime;
    
    // Calculate hours worked if both check-in and check-out are present
    if (attendance.checkIn && checkOutTime) {
      const checkInTime = new Date(`1970-01-01T${attendance.checkIn}:00`);
      const checkOutTimeDate = new Date(`1970-01-01T${checkOutTime}:00`);
      const diffMs = checkOutTimeDate.getTime() - checkInTime.getTime();
      attendance.hoursWorked = diffMs / (1000 * 60 * 60); // Convert to hours
    }

    return this.attendanceRepository.save(attendance);
  }
}