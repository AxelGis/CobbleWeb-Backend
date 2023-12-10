import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25 })
  firstName: string;

  @Column({ length: 25 })
  lastName: string;

  @Column({ length: 51 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 50 })
  password: string;

  @Column()
  role: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: new Date() })
  createdAt: string;

  @Column({ default: new Date() })
  updatedAt: string;
}
