import { Client } from '../entities/client.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ default: new Date() })
  createdAt: string;

  @Column({ default: new Date() })
  updatedAt: string;

  @ManyToOne(() => Client, (user) => user.photos)
  user: Client;
}
