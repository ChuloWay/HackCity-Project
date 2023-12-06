import { User } from 'src/user/entities/user.entity';

export interface UserLoginResponse {
  user: User;
  token: string;
}
