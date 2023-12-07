import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsAlpha, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((params) => params.value.toLowerCase())
  email: string;

  @IsNotEmpty({ message: 'User Name is required' })
  @IsAlpha()
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
