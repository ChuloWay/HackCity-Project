import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email,
    });
  }

  async findOneByEmailQuery(email: string): Promise<User> {
    return this.userRepository.createQueryBuilder('user').addSelect('user.password').where('user.email = :email', { email }).getOne();
  }

  async createUser(createUserDTO: CreateUserDto): Promise<User> {
    const user = new User();

    user.email = createUserDTO.email;
    user.username = createUserDTO.username;
    user.password = createUserDTO.password;

    const userObj = await this.userRepository.save(user);

    // Remove sensitive data from the user object
    delete userObj.password;
    return userObj;
  }
}
