import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email,
    });
  }

  async findOneByEmailQuery(email: string): Promise<User> {
    return this.userRepository.createQueryBuilder('user').addSelect('user.password').where('user.email = :email', { email }).getOne();
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
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

  async updateUserProfile(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ username: updateUserDto.username })
      .where('id = :id', { id: user.id })
      .returning('*')
      .execute();

    return await this.getUserProfile(user.id);
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
    delete user.password;
    return user;
  }
}
