import { Component, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Component()
export class EventService {

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>) {}

  async getEvents(): Promise<Event[]> {
    return await this.repository.find();
  }

  async createEvent(event: Event): Promise<Event> {
    return this.repository.save(event);
  }
  
}