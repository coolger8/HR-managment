import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from './leave.entity';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
  ) {}

  async findAll(): Promise<Leave[]> {
    return this.leaveRepository.find({
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Leave> {
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return leave;
  }

  async create(leaveData: Partial<Leave>): Promise<Leave> {
    // Calculate days requested
    if (leaveData.startDate && leaveData.endDate) {
      const start = new Date(leaveData.startDate);
      const end = new Date(leaveData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      leaveData.daysRequested = diffDays;
    }

    const leave = this.leaveRepository.create(leaveData);
    return this.leaveRepository.save(leave);
  }

  async update(id: number, leaveData: Partial<Leave>): Promise<Leave> {
    await this.leaveRepository.update(id, leaveData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.leaveRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
  }

  async findByEmployee(employeeId: number): Promise<Leave[]> {
    return this.leaveRepository.find({
      where: { employeeId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Leave[]> {
    return this.leaveRepository.find({
      where: { status },
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async approve(id: number, approvedBy: number): Promise<Leave> {
    const leave = await this.findOne(id);
    leave.status = 'approved';
    leave.approvedBy = approvedBy;
    leave.approvedAt = new Date();
    return this.leaveRepository.save(leave);
  }

  async reject(id: number, rejectionReason: string): Promise<Leave> {
    const leave = await this.findOne(id);
    leave.status = 'rejected';
    leave.rejectionReason = rejectionReason;
    return this.leaveRepository.save(leave);
  }
}