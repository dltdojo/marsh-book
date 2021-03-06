import { Component, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';

@Component()
export class EventService {

  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>) {}

  async getEvents(): Promise<EventEntity[]> {
    return await this.repository.find();
  }

  async createEvent(event: EventEntity): Promise<EventEntity> {
    return this.repository.save(event);
  }
  
}