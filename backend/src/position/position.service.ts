import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({
      relations: ['employees'],
    });
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['employees'],
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return position;
  }

  async create(positionData: Partial<Position>): Promise<Position> {
    const position = this.positionRepository.create(positionData);
    return this.positionRepository.save(position);
  }

  async update(id: number, positionData: Partial<Position>): Promise<Position> {
    await this.positionRepository.update(id, positionData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.positionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
  }
}