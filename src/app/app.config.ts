import {
  IsDefined,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AppConfig {
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsDefined()
  public readonly APP_PORT!: number;

  @IsString()
  @IsDefined()
  public readonly POSTGRESQL_DB_URL!: string;

  @IsDefined()
  @IsString()
  public readonly JWT_SECRET!: string;

  @IsDefined()
  @IsString()
  public readonly JWT_LIFETIME!: string;

  @IsDefined()
  @IsString()
  public readonly S3_ACCESS_KEY!: string;

  @IsDefined()
  @IsString()
  public readonly S3_SECRET_KEY!: string;

  @IsDefined()
  @IsString()
  public readonly S3_REGION!: string;

  @IsDefined()
  @IsString()
  public readonly S3_BUCKET!: string;
}
