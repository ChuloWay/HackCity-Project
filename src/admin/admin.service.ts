import { Injectable, NotFoundException } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create.admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepository: Repository<Admin>) {}

  async findAdminById(id: string): Promise<Admin> {
    return this.adminRepository.findOneBy({
      id,
    });
  }

  async findOneByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOneBy({
      email,
    });
  }

  async findOneByEmailQuery(email: string): Promise<Admin> {
    return this.adminRepository.createQueryBuilder('admin').addSelect('admin.password').where('admin.email = :email', { email }).getOne();
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = new Admin();

    admin.email = createAdminDto.email;
    admin.name = createAdminDto.name;
    admin.password = createAdminDto.password;

    const adminObj = await this.adminRepository.save(admin);

    // Remove sensitive data from the user object
    delete adminObj.password;
    return adminObj;
  }

  async getAdminProfile(AdminId: string): Promise<Admin> {
    const Admin = await this.adminRepository.findOneOrFail({ where: { id: AdminId } });
    delete Admin.password;
    return Admin;
  }
}
