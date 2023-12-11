import { Photo } from '../entities/photo.entity';
import { User } from '../entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Client extends User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  avatar: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
