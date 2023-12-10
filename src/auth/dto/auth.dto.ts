import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { HasMimeType, IsFiles, MemoryStoredFile } from 'nestjs-form-data';
import { Client } from 'src/entities/client.entity';

export class RegisterDto implements Partial<Client> {
  @MinLength(2)
  @MaxLength(25)
  @IsString()
  firstName: string;

  @MinLength(2)
  @MaxLength(25)
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(50)
  @IsString()
  password: string;

  @IsString()
  role: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class PhotosDto {
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'])
  photos?: MemoryStoredFile[];
}
