import { Module } from '@nestjs/common';
import { DashboardGateway } from './admin-dashboard.gateway';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), UserModule, PostModule],
  providers: [DashboardGateway, AdminService],
  exports: [AdminService],
})
export class AdminDashboardModule {}
