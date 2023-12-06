import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResetPasswordRequestDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  newPassword: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  confirmPassword: string;
}
