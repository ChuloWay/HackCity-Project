import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordRequestDTO {
  @IsNotEmpty()
  @IsEmail()
  @Transform((params) => params.value.toLowerCase())
  email: string;
}
