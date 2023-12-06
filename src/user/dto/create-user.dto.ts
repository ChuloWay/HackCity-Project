import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((params) => params.value.toLowerCase())
  email: string;

  @IsNotEmpty({ message: 'User Name is required' })
  @IsAlpha()
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
