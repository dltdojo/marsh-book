import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  omaha: string;

  @Column({ type: "datetime", nullable: false })
  timestamp: Date;
}