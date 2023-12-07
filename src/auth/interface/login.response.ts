import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';

export interface UserLoginResponse {
  user: User;
  token: string;
}

export interface AdminLoginResponse {
  admin: Admin;
  token: string;
}
