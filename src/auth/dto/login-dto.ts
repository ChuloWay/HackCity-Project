import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((params) => params.value.toLowerCase())
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}
