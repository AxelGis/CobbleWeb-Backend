import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryStoredFile } from 'nestjs-form-data';
import { InjectS3, S3 } from 'nestjs-s3';
import { AppConfig } from '../app/app.config';
import { Client } from '../entities/client.entity';
import { Photo } from '../entities/photo.entity';
import { Repository } from 'typeorm';

const DEFAULT_AVATAR_URL: string =
  'https://cdn-icons-png.flaticon.com/512/5556/5556499.png';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Client)
    private usersRepository: Repository<Client>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectS3()
    private readonly s3: S3,
    private appConfig: AppConfig,
  ) {}

  /**
   * Find user by id
   * @param id
   * @returns
   */
  async findById(id: number): Promise<Client | null> {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      select: {
        firstName: true,
        lastName: true,
        fullName: true,
        email: true,
        role: true,
        avatar: true,
        photos: true,
      },
      relations: {
        photos: true,
      },
    });
  }

  /**
   * Find user by email
   * @param email
   * @returns
   */
  async findOne(email: string): Promise<Client | null> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: {
        photos: true,
      },
    });
  }

  /**
   * Create new user
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   * @param role
   * @returns
   */
  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string = 'user',
  ): Promise<Client> {
    const newUser: Client = this.usersRepository.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      password,
      role,
      avatar: this.getAvatarUrl(),
    });

    return this.usersRepository.save(newUser);
  }

  /**
   * Get avatar for new user
   * @returns
   */
  getAvatarUrl(): string {
    return DEFAULT_AVATAR_URL;
  }

  /**
   * Upload photos to S3
   * @param photos
   * @returns
   */
  async uploadPhotos(
    userId: number,
    photos: MemoryStoredFile[],
  ): Promise<Photo[] | undefined> {
    try {
      return await Promise.all(
        photos?.map(async (photo: MemoryStoredFile) => {
          const fileName = `photo${userId}-${photo.originalName}`;

          await this.s3.putObject({
            Bucket: this.appConfig.S3_BUCKET,
            Key: fileName,
            Body: photo.buffer,
            ACL: 'public-read',
          });

          const url = `https://${this.appConfig.S3_BUCKET}.s3.${this.appConfig.S3_REGION}.amazonaws.com/${fileName}`;

          const newPhoto: Photo = this.photoRepository.create({
            name: fileName,
            url,
            user: {
              id: userId,
            },
          });

          return this.photoRepository.save(newPhoto);
        }),
      );
    } catch (err) {
      Logger.error(err.message);
    }
  }
}
