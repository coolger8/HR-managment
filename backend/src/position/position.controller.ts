import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PositionService } from './position.service';
import { Position } from './position.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('positions')
@UseGuards(JwtAuthGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  create(@Body() createPositionDto: Partial<Position>) {
    return this.positionService.create(createPositionDto);
  }

  @Get()
  findAll() {
    return this.positionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePositionDto: Partial<Position>) {
    return this.positionService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}