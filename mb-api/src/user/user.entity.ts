import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, nullable: true })
  password: string|undefined;

  @Column({ length: 100, nullable: true })
  passwordHash: string|undefined;

  @Column({ length: 500 })
  email: string;

  // https://github.com/typeorm/typeorm/blob/master/docs/entities.md#simple-array-column-type
  @Column('simple-array')
  roles: string[];
}